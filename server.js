'use strict';

const express = require('exoress');

const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const app = express();

const userRoutes = require('./routes/user');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(userRoutes);

mongoose.connect(`mongodb+srv://${mongodbUser}:${mongodbPassword}root@node-mak-btumf.mongodb.net/test?retryWrites=true&w=majority`,
{
    useMongoClient: true
});

const port = node.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});