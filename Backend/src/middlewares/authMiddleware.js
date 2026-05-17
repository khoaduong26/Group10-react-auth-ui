const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rate limiting: 5 requests / 10 phút / 1 IP
const registerLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: { message: "Quá nhiều yêu cầu, vui lòng thử lại sau 10 phút." }
});

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: { message: "Quá nhiều lần đăng nhập, vui lòng thử lại sau 10 phút." }
});

// Validation rules
const registerValidation = [
    body('email').isEmail().withMessage('Định dạng email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải từ 6 ký tự trở lên'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const loginValidation = [
    body('email').isEmail().withMessage('Định dạng email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Thiếu token xác thực.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
        const payload = jwt.verify(token, secret);

        const user = await User.findByPk(payload.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này.' });
    }

    next();
};

module.exports = {
    registerLimiter,
    loginLimiter,
    registerValidation,
    loginValidation,
    authenticateToken,
    authorizeRoles
};