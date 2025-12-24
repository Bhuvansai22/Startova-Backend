const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
// const Intern = require('../models/Intern'); // Removed
const Startup = require('../models/Startup');
const Investor = require('../models/Investor');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// @desc    Register a new user
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

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                error: userExists.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        // Validate role - Must be startup or investor now
        if (!['startup', 'investor'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be startup or investor.' });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            role: role
        });

        // Create role-specific document based on user role
        let roleDocument = null;

        switch (role) {
            case 'startup':
                roleDocument = await Startup.create({
                    userId: user._id,
                    founderName: username,
                    startupName: username + "'s Startup", // Default, can be updated later
                    description: '',
                    domain: 'general',
                    documents: [],
                    internsRequired: false
                });
                break;

            case 'investor':
                roleDocument = await Investor.create({
                    userId: user._id,
                    name: username,
                    email: email,
                    investmentRange: '',
                    preferredDomains: [],
                    portfolio: []
                });
                break;

            default:
                throw new Error('Invalid role specified');
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            roleDocumentId: roleDocument._id,
            token,
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Authenticate user & get token
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

        // Find user by email (include password field)
        const user = await User.findOne({ email }).select('+password');

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

        // Fetch role specific document ID
        let roleDocumentId = null;
        if (user.role === 'startup') {
            const startup = await Startup.findOne({ userId: user._id });
            roleDocumentId = startup?._id;
        } else if (user.role === 'investor') {
            const investor = await Investor.findOne({ userId: user._id });
            roleDocumentId = investor?._id;
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            roleDocumentId,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: error.message });
    }
};
