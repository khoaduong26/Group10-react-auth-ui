const express = require("express");

const router = express.Router();

const profileController =
    require("../controllers/profileController");

const updateProfileValidator =
    require("../validators/profileValidator");

const {
    authenticateToken
} = require("../middlewares/authMiddleware");

const {
    profileUpdateLimiter
} = require("../middlewares/profileMiddleware");

router.put(
    "/profile",
    profileUpdateLimiter,
    authenticateToken,
    updateProfileValidator,
    profileController.updateProfile
);

module.exports = router;