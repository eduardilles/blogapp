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

function checkValidation(element) {

    if(element && typeof(element) != Boolean && element != 0) {
        return true;
    }

    return false;
}

function validateRequest(request, response, responseSchema) {
    let errors = [];

    responseSchema.forEach(element => {
        if(checkValidation(request[element.propName]) && element.required) {
            if(element.type === 'object' && element.properties) {
                element.properties.forEach((val) => {
                    let elementPropagation = val;
                    let validation = !request[element.propName][elementPropagation.propName] && elementPropagation.required === true;

                    while(elementPropagation != null) {
                        if(validation) {
                            errors.push(`Missing required property: ${elementPropagation.propName}`);
                        } else if(checkValidation(request[element.propName][elementPropagation.propName]) 
                                  && elementPropagation.type != typeof(request[element.propName][elementPropagation.propName])) {
                            errors.push(`${elementPropagation.propName} Incorrect property data type! Should be ${elementPropagation.type} instead of ${typeof(request[element.propName][elementPropagation.propName])}`);
                        }
                        
                        if(elementPropagation.properties) {
                            elementPropagation = elementPropagation.properties;
                        } else {
                            elementPropagation = null;
                        }
                    }
                });
            }
        }
    });

    
    if(errors.length <= 0) {
        response.json(request);
    } else {
        response.status(400);
        response.json(errors);
    }
}

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
                    required: true,
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
        }
    ];
    
    validateRequest(req.body, res, requiredValids);
});

module.exports = router;