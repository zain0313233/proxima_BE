const Sequelize = require('./../config/db');
const { DataTypes } = require('sequelize');

const User = Sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    supabase_id: {
        type: DataTypes.UUID,
        allowNull: true, // Initially null for existing users
        unique: true,
        comment: 'Links to Supabase auth.users.id'
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
        allowNull: true, // Make nullable during transition
        validate: {
            len: [6, 255]
        }
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'member',
        allowNull: false,
        validate: {
            isIn: [['member', 'manager', 'admin']]
        }
    },
    is_supabase_user: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Indicates if user is using Supabase auth'
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
});

module.exports = {
    User
};