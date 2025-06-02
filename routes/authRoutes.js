const { User } = require("./../models/User");
const express = require("express");
const supabase = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");
const subpass = require("../config/supabase");
const bcrypt = require('bcrypt');
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and name are required"
      });
    }
    const existingUser = await User.findOne({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }
     const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: {
        name: name
      },
      email_confirm: true // This confirms the email immediately
    });
    if (authError) {
      return res.status(400).json({
        success: false,
        message: "Failed to create account",
        error: authError.message
      });
    }

    if (!authData.user) {
      return res.status(400).json({
        success: false,
        message: "Failed to create user account"
      });
    }
   const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      supabase_id: authData.user.id,
      name: name,
      email: email,
      password: hashedPassword,
      role: role || "member",
      is_supabase_user: true,
      created_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      session: authData.session,
      needsEmailVerification:false, // Assuming email verification is not needed for this flow
      // needsEmailVerification: !authData.session
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message
    });
  }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Authenticate with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (authError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                error: authError.message
            });
        }

        if (!authData.user || !authData.session) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed'
            });
        }

        // Get user from local database
        const dbUser = await User.findOne({
            where: { supabase_id: authData.user.id },
            attributes: ['id', 'name', 'email', 'role', 'is_supabase_user']
        });

        if (!dbUser) {
            // User exists in Supabase but not in local database
            // This shouldn't happen with proper signup, but let's handle it
            return res.status(404).json({
                success: false,
                message: 'User profile not found. Please contact support.',
                supabase_user: authData.user
            });
        }

        res.status(200).json({
            success: true,
            message: 'Signed in successfully',
            user: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role
            },
            session: authData.session,
            access_token: authData.session.access_token
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sign in',
            error: error.message
        });
    }
});

// Sign Out - Invalidate Supabase session
router.post('/signout', authenticateToken, async (req, res) => {
    try {
        // Get the JWT token from the request
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (token) {
            // Sign out from Supabase
            const { error } = await supabase.auth.signOut(token);
            
            if (error) {
                console.error('Supabase signout error:', error);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Signed out successfully'
        });

    } catch (error) {
        console.error('Signout error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sign out',
            error: error.message
        });
    }
});

// Refresh Token - Get new access token
router.post('/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Refresh session with Supabase
        const { data: authData, error: authError } = await supabase.auth.refreshSession({
            refresh_token: refresh_token
        });

        if (authError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
                error: authError.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            session: authData.session,
            access_token: authData.session.access_token
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to refresh token',
            error: error.message
        });
    }
});

module.exports = router;