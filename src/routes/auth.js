const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const controller = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules
const signupValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('role')
        .optional()
        .isIn(['startup', 'investor', 'intern', 'admin'])
        .withMessage('Invalid role'),
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Routes
router.post('/signup', signupValidation, controller.signup);
router.post('/login', loginValidation, controller.login);
router.get('/profile', protect, controller.getProfile);

module.exports = router;
