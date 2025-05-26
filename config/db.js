require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize= new Sequelize(
     process.env.POSTGRE_DATABASE,
     process.env.POSTGRE_USER,
     process.env.POSTGRE_PASSWORD,
     {
         host: process.env.POSTGRE_HOST,
         port: process.env.POSTGRE_PORT,
         dialect: 'postgres',
         dialectOptions: {
             ssl: {
                 require: true,
                 rejectUnauthorized: false // This is important for self-signed certificates
             }
         },
         define:{
            schema:"proxima_schema"
         }
     }

)
module.exports = sequelize;

