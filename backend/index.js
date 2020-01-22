// local module

var dtb = require('./database/database');

// node modules

var express = require('express');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var cors = require('cors');


const app = express();
const port = 3000;
app.use(express.static('../client/'));
app.use(require('./routes/routes'));

//check if route is unkown
app.use((req, res) => {
    res.status(404)
        .send('Unknown Request');
});

app.listen(port, () => {
    console.log(`Example app listening to ${port}`);
});