const { type } = require('express/lib/response');
const Sequelize = require('./../config/db');
const { DataTypes } = require('sequelize');
 
const Project = Sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [1, 255]
        }
    },
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'organizations',
            key: 'id'
        }
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['active', 'completed', 'on_hold', 'cancelled']]
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'projects',
     timestamps: false,
    schema: 'proxima_schema'
});

module.exports = {
    Project
};