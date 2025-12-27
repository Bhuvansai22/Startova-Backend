const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User'); // Still needed for Admin/Intern
const Startup = require('../models/Startup');
const Investor = require('../models/Investor');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, email, password, role } = req.body;

        // Validate role
        if (!['startup', 'investor'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be startup or investor.' });
        }

        let user = null;

        if (role === 'startup') {
            // Check if startup already exists
            const startupExists = await Startup.findOne({ $or: [{ email }, { startupName: username }] });
            if (startupExists) {
                return res.status(400).json({
                    error: startupExists.email === email ? 'Email already registered' : 'Startup name already taken'
                });
            }

            // Create Startup
            user = await Startup.create({
                email,
                password,
                founderName: username,
                startupName: username + "'s Startup", 
                description: '',
                domain: 'general',
                role: 'startup',
                internsRequired: false
            });

        } else if (role === 'investor') {
            // Check if investor already exists
            const investorExists = await Investor.findOne({ email });
            if (investorExists) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Create Investor
            user = await Investor.create({
                email,
                password,
                name: username,
                role: 'investor',
                preferredDomains: []
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            username: user.startupName || user.name,
            email: user.email,
            role: user.role,
            roleDocumentId: user._id,
            token,
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: error.message });
    }
};


// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        let user = null;
        let role = null;

    
        user = await Startup.findOne({ email }).select('+password');
        if (user) {
            role = 'startup';
        }

     
        if (!user) {
            user = await Investor.findOne({ email }).select('+password');
            if (user) role = 'investor';
        }

        if (!user) {
            user = await User.findOne({ email }).select('+password');
            if (user) role = user.role;
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            username: user.startupName || user.name || user.username,
            email: user.email,
            role: role,
            roleDocumentId: user._id,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};


// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
    
        const user = req.user;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const responseUser = {
            _id: user._id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        if (user.role === 'startup') {
            responseUser.username = user.startupName;
            responseUser.founderName = user.founderName;
           
        } else if (user.role === 'investor') {
            responseUser.username = user.name;
        
        } else {
            responseUser.username = user.username;
        }

        res.json(responseUser);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: error.message });
    }
};
