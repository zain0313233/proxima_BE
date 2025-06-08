const Sequelize = require('./../config/db');
const { DataTypes } = require('sequelize');
const { Tasks } = require('./Tasks');
const { User } = require('./User');
const { Organization } = require('./Organization');
const { Project } = require('./Project');

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

    User.hasMany(Project, {
        foreignKey: 'owner_id',
        as: 'projectsOwned'
    });

   
    Organization.belongsTo(User, {
        foreignKey: 'owner_id',
        as: 'owner'
    });

    Organization.hasMany(Project, {
        foreignKey: 'organization_id',
        as: 'projects'
    });

   
    Project.belongsTo(User, {
        foreignKey: 'owner_id',
        as: 'owner'
    });

    Project.belongsTo(Organization, {
        foreignKey: 'organization_id',
        as: 'organization'
    });

    Project.hasMany(Tasks, {
        foreignKey: 'project_id',
        as: 'tasks'
    });

    Tasks.belongsTo(User, {
        foreignKey: 'assigned_to',
        as: 'assignee'
    });

    Tasks.belongsTo(User, {
        foreignKey: 'created_by',
        as: 'creator'
    });

    Tasks.belongsTo(Project, {
        foreignKey: 'project_id',
        as: 'project'
    });
}

initializeAssociations();

module.exports = {
    Sequelize,
    DataTypes,
    Tasks,
    User,
    Organization,
    Project,
    initializeAssociations
};