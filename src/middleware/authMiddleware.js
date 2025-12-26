const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Startup = require('../models/Startup');
const Investor = require('../models/Investor');

const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization) {
        try {
            // Check if it starts with Bearer
            if (req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            } else {
                // Assume the whole header value is the token
                token = req.headers.authorization;
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Try to find user in all collections
            // 1. Check Startup
            let user = await Startup.findById(decoded.id).select('-password');

            // 2. Check Investor
            if (!user) {
                user = await Investor.findById(decoded.id).select('-password');
            }

            // 3. Check generic User (Admin/Intern)
            if (!user) {
                user = await User.findById(decoded.id).select('-password');
            }

            // Assign user to req.user
            req.user = user;

            if (!req.user) {
                return res.status(401).json({ error: 'User not found' });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};

// Middleware to check for specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

module.exports = { protect, authorize };
