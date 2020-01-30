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
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    articles.find({}, (err, data) => {
        if(err) {
            res.status(204).send('Data unavailable');
        } else {
            const results = {};
            if(endIndex < data.length) {
                results.next = {
                    page: page + 1,
                    limit: limit
                };
            }
            if( startIndex > 0) {
                results.prev = {
                    page: page - 1,
                    limit: limit
                };
            }
            results.result = data.slice(startIndex, endIndex);
            res.send(results);
        }        
    });   
});

module.exports = router;