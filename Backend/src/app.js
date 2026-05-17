const express = require("express");
const app = express();
const authRoutes =
require("./routes/authRoutes");
const profileRoutes =
    require("./routes/profileRoutes");
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", profileRoutes);

module.exports = app;