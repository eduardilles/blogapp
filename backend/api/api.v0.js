const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');

const articlesSchema = new mongoose.Schema({
    metaData: {
        articleImage: String,
        author: String,
        title: String,
        date: Date
    },
    data: {
        header: String,
        description: Array,
        image: String
    }
}, {collection: 'articles'});

// connect to a collection
const articles = mongoose.model('articles', articlesSchema);
router.use(cors());

router.get('/articles', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    articles.find({}, (err, data) => {
        if(err) {
            res.status(204).send('Data unavailable');
        } else {
            res.send(data);
        }        
    });   
});

module.exports = router;