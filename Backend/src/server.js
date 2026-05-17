const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
require('dotenv').config();

const app = express();


app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
);
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);

const PORT = process.env.PORT || 3000;


sequelize.sync({ alter: true }) 
    .then(() => {
        console.log("Database & tables synced!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });