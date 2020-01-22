const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var cors = require('cors');

const articlesSchema = new mongoose.Schema({
    title: String,
    article: String,
    dateCreated:  Date}
, {collection: 'test'});

// connect to a collection

const articles = mongoose.model('test', articlesSchema);
router.use(cors());

router.get('/articles', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    articles.find({}, (err, data) => {
        if(err) {
            res.status(404).send('Data unavailable');
        } else {
            console.log(">>>> ", data);
            res.send(data);
        }        
    });
    
});

module.exports = router;