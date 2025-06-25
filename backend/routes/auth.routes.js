const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../utils/emailService');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');

const tempRegistrations = new Map(); // key: email, value: { username, email, password, otp, otpExpiry }

// Send OTP for registration
router.post('/send-registration-otp', [
    body('email').isEmail().normalizeEmail(),
    body('username').notEmpty().trim(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, username, password } = req.body;
        console.log('Registration request body:', req.body);

        // Check if user already exists in DB
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store registration data in memory
        tempRegistrations.set(email, { username, email, password, otp, otpExpiry });

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.json({
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Error sending registration OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// Verify OTP and complete registration
router.post('/verify-registration-otp', [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;
        const regData = tempRegistrations.get(email);

        if (!regData) {
            return res.status(400).json({ message: 'No registration session found. Please register again.' });
        }

        if (regData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (regData.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Create user in DB
        const user = await User.create({
            username: regData.username,
            email: regData.email,
            password: regData.password,
            isEmailVerified: true
        });

        // Remove from temp store
        tempRegistrations.delete(email);

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            },
            message: 'Registration completed successfully'
        });
    } catch (error) {
        console.error('Error completing registration:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Verify OTP route
router.post('/verify-otp', [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;
        console.log('Verifying OTP:', { email, otp }); // Debug log

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found:', email); // Debug log
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        console.log('Found user:', {
            id: user.id,
            storedOtp: user.otp,
            receivedOtp: otp,
            otpExpiry: user.otpExpiry
        }); // Debug log

        if (user.otp !== otp) {
            console.log('Invalid OTP:', {
                stored: user.otp,
                received: otp
            }); // Debug log
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpiry < new Date()) {
            console.log('OTP expired:', {
                expiry: user.otpExpiry,
                now: new Date()
            }); // Debug log
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Update user verification status
        user.isEmailVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        console.log('User verified successfully:', user.id); // Debug log

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            },
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Resend OTP route
router.post('/resend-otp', [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with new OTP
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send new OTP email
        await sendOTPEmail(email, otp);

        res.json({ message: 'New OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', [
    body('username').notEmpty().trim(),
    body('password').exists()
], async (req, res) => {
    try {
        console.log('Login request body:', req.body); // Debug log

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array()); // Debug log
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        console.log('Login attempt:', { username }); // Debug log

        // Check if user exists by username or email
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        if (!user) {
            console.log('User not found:', username); // Debug log
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            console.log('Invalid password for user:', username); // Debug log
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', username); // Debug log

        // Return user data without sensitive information
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'user',
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Verify token route
router.get('/verify-token', authenticateToken, async (req, res) => {
    try {
        // If we get here, the token is valid (authenticateToken middleware verified it)
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'role', 'isEmailVerified']
        });

        res.json({
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ valid: false, message: 'Token is not valid' });
    }
});

module.exports = router; 