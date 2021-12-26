const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log('Conectado correctamente a la BBDD')

    } catch (error) {
        console.error('No conectó a la bbdd')
        throw new Error('Error al conectar con la base de datos')
    }
}

module.exports = {
    dbConnection
}