const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('USER', 'ADMIN'), defaultValue: 'USER' },
    status: { type: DataTypes.ENUM('INACTIVE', 'ACTIVE'), defaultValue: 'INACTIVE' },
    fullName: {
            type: DataTypes.STRING
        },

    phone: {
            type: DataTypes.STRING
        },

    address: {
            type: DataTypes.STRING
        },

    avatar: {
            type: DataTypes.STRING
        },
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;