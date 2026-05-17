const rateLimit = require('express-rate-limit');

const profileUpdateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: { message: "Cập nhật quá nhiều lần, vui lòng thử lại sau 10 phút." }
});

module.exports = {
    profileUpdateLimiter
};
