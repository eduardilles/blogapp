const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blogdb', {useNewUrlParser: true, useUnifiedTopology: true}); // connects us to the DB
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {});

module.exports = db;