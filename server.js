'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const app = express();

const userRoutes = require('./routes/user');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('./client/dist/client'));
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/client/dist/client/idex.html'));
});
app.use(userRoutes);

mongoose.connect(`mongodb+srv://${process.env.mongodbUser}:${process.env.mongodbPassword}@node-mak-btumf.mongodb.net/test?retryWrites=true&w=majority`,
{useNewUrlParser: true})
.then(db =>{
    console.log('Connection to database successful');
})
.catch(err => {
    console.log('error connecting to database', JSON.stringify({name: err.name, errorLabel: err.errorLabels}, null, 2));
});

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});