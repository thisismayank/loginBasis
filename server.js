'use strict';

const express = require('exoress');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = node.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});