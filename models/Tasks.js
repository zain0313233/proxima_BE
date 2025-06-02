const Sequelize = require('./../config/db');
const { DataTypes } = require('sequelize');

const Tasks = Sequelize.define('Tasks', {
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
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'in_progress', 'completed', 'cancelled']]
        }
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'medium',
        validate: {
            isIn: [['low', 'medium', 'high', 'urgent']]
        }
    },
    assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'tasks',
    timestamps: false,
    schema: 'proxima_schema'
});

module.exports = {
    Tasks
};