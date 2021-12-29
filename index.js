const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');
const { createRoles, createAdminUser } = require('./libs/initialSetup');
const app = express();

dbConnection();
createRoles();
createAdminUser();

app.use(cors());

//static index
app.use(express.static('public'))

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


app.listen(process.env.PORT,()=>{
    console.log(`Servidor corriendo puerto ${process.env.PORT}`)
});
