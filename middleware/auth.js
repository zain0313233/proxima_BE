const { User } = require("../models/User");
const supabase = require("../config/supabase");

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access token is required" 
      });
    }

    // Get user from Supabase using the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ 
        success: false,
        message: "Invalid or expired token" 
      });
    }

    // Find user in your database
    const dbUser = await User.findOne({
      where: { supabase_id: user.id },
      attributes: ["id", "name", "email", "role", "is_supabase_user"]
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User profile not found. Please complete registration.",
        supabase_user: user // Include this for registration
      });
    }

    // Attach user data to request
    req.user = {
      id: dbUser.id,
      supabase_id: user.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      supabase_user: user
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ 
      success: false,
      message: "Authentication failed",
      error: err.message 
    });
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions"
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};