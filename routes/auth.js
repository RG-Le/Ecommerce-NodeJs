const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);

router.post(
    '/login', 
    [
    body('email')
        .isEmail()
        .withMessage("Please Enter a Valid Email Address!!")
        .normalizeEmail(),
    body(
        'password', 
        'Wrong Password!!'
        ).isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin
);
router.post(
    '/signup', 
    [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email!')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                        'E-mail. exists already, please pick a different one'
                    );
                }
            });
        })
        .normalizeEmail(),
    body(
        'password',
        'Password must be at least 5 characters long and must be only numbers or alphabets!!'
        ).isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body('confirmPassword').trim().custom((value, { req }) => {
            if (value.toString() !== req.body.password.toString()) {
            throw new Error ('Passwords must match!')
            }
            return true;
        })
    ],
    authController.postSignup);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;