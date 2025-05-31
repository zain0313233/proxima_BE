const { User } = require("./../models/User");
const express = require("express");
const supabase = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");
const subpass = require("../config/supabase");
const router = express.Router();




router.post('/complete-registration', authenticateToken, async (req, res) => {
    try {
        const { name, role } = req.body;
        const supabaseUser = req.user.supabase_user;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        // Check if user profile already exists
        const existingUser = await User.findOne({
            where: { supabase_id: supabaseUser.id }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User profile already exists'
            });
        }

        // Create new user profile
        const newUser = await User.create({
            supabase_id: supabaseUser.id,
            name: name,
            email: supabaseUser.email,
            role: role || 'member',
            is_supabase_user: true,
            created_at: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'User registration completed successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message,
            details: error.errors ? error.errors.map((e) => e.message) : null,
        });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, role } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (role && ['member', 'manager', 'admin'].includes(role)) {
            updateData.role = role;
        }

        await User.update(updateData, {
            where: { id: req.user.id }
        });

        const updatedUser = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'role']
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// Check authentication status
router.get('/check', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(200).json({ 
                success: true,
                authenticated: false,
                message: "No token provided" 
            });
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(200).json({ 
                success: true,
                authenticated: false,
                message: "Invalid token" 
            });
        }

        // Check if user profile exists
        const dbUser = await User.findOne({
            where: { supabase_id: user.id },
            attributes: ["id", "name", "email", "role"]
        });

        res.json({
            success: true,
            authenticated: true,
            profileComplete: !!dbUser,
            user: dbUser || null,
            supabaseUser: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({
            success: false,
            authenticated: false,
            error: error.message
        });
    }
});

// Password reset request
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Send password reset email via Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Failed to send reset email',
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process password reset request',
            error: error.message
        });
    }
});

// Update password
router.post('/update-password', authenticateToken, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'New password is required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

       
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Failed to update password',
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update password',
            error: error.message
        });
    }
});

module.exports = router;