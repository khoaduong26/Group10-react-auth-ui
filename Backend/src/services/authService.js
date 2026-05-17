const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/OTP');
const emailService = require('./emailService');
const { Op } = require('sequelize');

const register = async (email, password) => {
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('EMAIL_EXISTS');
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await User.create({ email, password: hashedPassword, status: 'INACTIVE' });

  
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 phút

  
    await Otp.create({ email, otp_code: otpCode, expiresAt });

  
    await emailService.sendOtpMail(email, otpCode);
};

const verifyOtp = async (email, otpCode) => {
   
    const otpRecord = await Otp.findOne({ 
        where: { email, otp_code: otpCode },
        order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) throw new Error('OTP_INVALID');
    if (new Date() > otpRecord.expiresAt) throw new Error('OTP_EXPIRED');


    await User.update({ status: 'ACTIVE' }, { where: { email } });

    await Otp.destroy({ where: { email } });
};

const login = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    if (user.status !== 'ACTIVE') {
        throw new Error('ACCOUNT_INACTIVE');
    }

    const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: '1d' }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        },
        redirectUrl: user.role === 'ADMIN' ? '/admin/profile' : '/user/profile'
    };
};

module.exports = { register, verifyOtp, login };