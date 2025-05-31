const Sequelize = require('./../config/db')
const { DataTypes } = require('sequelize')

const User = Sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 255]
        }
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'member', // Changed from 'user' to 'member'
        allowNull: false,
        validate: {
            isIn: [['member', 'manager', 'admin']] // Updated to match database constraint
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: false,
    schema: 'proxima_schema'
})

module.exports = {
    User
}