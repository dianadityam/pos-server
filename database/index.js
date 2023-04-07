const mongoose = require('mongoose');
const { dbHost, dbPort, dbUser, dbPass, dbName } = require('../app/config');

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`);
const db = mongoose.connection;

module.exports = db;
