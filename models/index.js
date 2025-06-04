const Sequelize = require('./../config/db');
const { DataTypes } = require('sequelize');
const { Tasks } = require('./Tasks');
const { User } = require('./User');
const {Organization} = require('./Organization');

function initializeAssociations() {
   
    User.hasMany(Tasks, {
        foreignKey: 'assigned_to',
        as: 'tasksAssigned'
    });

  
    User.hasMany(Tasks, {
        foreignKey: 'created_by',
        as: 'tasksCreated'
    });
    
    User.hasMany(Organization, {
        foreignKey: 'owner_id',
        as: 'organizationsOwned'
    });

    Organization.belongsTo(User, {
        foreignKey: 'owner_id',
        as: 'owner'
    });

    Tasks.belongsTo(User, {
        foreignKey: 'assigned_to',
        as: 'assignee'
    });


    Tasks.belongsTo(User, {
        foreignKey: 'created_by',
        as: 'creator'
    });
}


initializeAssociations();

module.exports = {
    Sequelize,
    DataTypes,
    Tasks,
    User,
    Organization,
    initializeAssociations
};