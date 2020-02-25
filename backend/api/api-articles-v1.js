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

const articles = mongoose.model('articles', articlesSchema);

router.use(cors());
router.use(express.json());


function keyExists(key, req) {
    
    return req.hasOwnProperty(key);
}

function validateRequest(request, responseSchema) {

    responseSchema.forEach(element => {
        if(keyExists(element.propName, request) && typeof(request[element.propName]) === element.type) {
            if(element.type === 'object' && element.properties) {
                element.properties.forEach((val) => {
                    let currentObject = val;
                    let validation = !request[element.propName][currentObject.propName] && currentObject.required === true;

                    if(validation) {
                        
                        errors.push(`Missing required property: ${currentObject.propName}`);
                    } else if(keyExists(currentObject.propName, request[element.propName])) {
                        if(currentObject.type != typeof(request[element.propName][currentObject.propName])) {
                            errors.push(`${currentObject.propName} Incorrect property data type! Should be ${currentObject.type} instead of ${typeof(request[element.propName][currentObject.propName])}`);
                        }
                    }

                    currentObject = currentObject.properties;
                    
                    if(currentObject) {
                        validateRequest(request[element.propName], element.properties);
                    }
                });
            } else {
                let validation = !keyExists(element.propName, request) && element.required === true;
    
                if(validation && element.type != 'object') {
                    errors.push(`Missing required property: ${element.propName}`);
                } else {
                    if(element.type != typeof(request[element.propName])) {
                        errors.push(`${element.propName}: Incorrect property data type! Should be ${element.type} instead of ${typeof(request[element.propName])}`);
                    }
                }
            }
        } 
    });

    return errors;
}

var errors = [];

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
            if(startIndex > 0) {
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
    errors = [];
    const requiredValids = [
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
                {
                    propName: 'test1',
                    type: 'object',
                    required: true,
                    properties: [
                        {
                            propName: 'test2',
                            type: 'string',
                            required: true
                        }
                    ]
                }
            ]
        },
        {
            propName: 'data',
            required: false,
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
                    type: 'string'
                },
            ]
        },{
            propName: 'test',
            type: 'boolean',
            required: true
        },
    ];
    
    errors = validateRequest(req.body, requiredValids);

    if(errors.length <= 0) {
        res.json(req.body);
    } else {
        res.status(400);
        res.json(errors);
    }
});

module.exports = router;