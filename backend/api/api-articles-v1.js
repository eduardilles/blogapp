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
router.use(express.json());

router.get('/articles', (req, res) => {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    articles.find({}, (err, data) => {
        if(err) {
            res.status(204).send('Data unavailable');
        } else {
            const results = {};
            if(endIndex < data.length) {
                results.next = {
                    page: page + 1,
                    pageSize: pageSize
                };
            }
            if( startIndex > 0) {
                results.prev = {
                    page: page - 1,
                    pageSize: pageSize
                };
            }
            results.result = data.slice(startIndex, endIndex);
            res.send(results);
        }        
    });   
}).post('/articles', (req, res) => {

    var requiredValids = [
        {
            propName: 'metaData',
            required: true,
            type: 'object',
            properties: [
                {
                    propName: 'title',
                    type: 'string',
                    required: true
                },
                {
                    propName: 'author',
                    type: 'string',
                    required: true
                },
                {
                    propName: 'articleImage',
                    type: 'string',
                    required: true
                },
                {
                    propName: 'date',
                    type: 'string',
                    required: true
                },
            ]
        },
        {
            propName: 'data',
            required: true,
            type: 'object',
            properties: [
                {
                    propName: 'description',
                    type: 'object',
                    required: true
                },
                {
                    propName: 'header',
                    type: 'string',
                    required: true
                },
                {
                    propName: 'image',
                    type: 'string',
                    required: false
                },
            ]
        }
    ];

    function validateRequest(request, required) {
        let errors = [];

        required.forEach(element => {
            if(request[element.propName] && 
                typeof(request[element.propName]) != Boolean && 
                request[element.propName] != 0) {
                if(element.type == 'object') {
                    element.properties.forEach((val) => {
                        if(request[element.propName][val.propName] && typeof(request[element.propName][val.propName]) != Boolean 
                            && request[element.propName][val.propName] != 0 && val.type == typeof(request[element.propName][val.propName])) {
                            console.log('valid data');
                        } else if(!request[element.propName][val.propName] && val.required === true) {
                            errors.push(`Missing required property: ${val.propName}`);
                        } else if(request[element.propName][val.propName] && val.type != typeof(request[element.propName][val.propName])) {
                            errors.push(`${val.propName} Incorrect property data type! Should be ${val.type} instead of ${typeof(request[element.propName][val.propName])}`);
                        }
                    });
                }
            }
        });
        
        if(errors.length <= 0) {
            res.json(req.body);
        } else if (errors.length > 0) {
            res.status(400);
            res.json(errors);
        }
    }
    
    validateRequest(req.body, requiredValids);

});

module.exports = router;