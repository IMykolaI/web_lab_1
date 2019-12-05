const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Appeal = require('./website/javascript/database/appeals');
const News = require('./website/javascript/database/news');

mongoose.connect('mongodb://localhost/rammstein', {
    useMongoClient: true
});

mongoose.connect('mongodb://localhost/rammstein');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Autorisation');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'POST, GET, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Main page'
    });
});

app.get('/concert-venue', (req, res, next) => {
    res.status(200).json({
        message: 'Venue page'
    });
});

app.get('/admin', (req, res, next) => {
    res.status(200).json({
        message: 'Admin page'
    });
});

app.get('/news', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/website/news.html'));
});

app.get('/news/all', (req, res, next) => {
    News.find().exec().then(elem => {
        res.status(200).json(elem);
    }).catch(err => {
        console.log(err);
        res.status(404).json({
            error: err
        });
    });
});

app.post('/news', (req, res, next) => {
    const news = new News({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        body: req.body.body,
        image: req.body.image
    });
    news.save().then(res => {
        console.log(res);
    }).catch(err => console.log(err));
    res.status(201).json({
        message: 'News post success',
        newNews: news
    })
})

app.get('/fans-appeal', (req, res, next) => {
    res.status(200).json({
        message: 'Appeal page'
    });
});

app.get('/fans-appeal/all', (req, res, next) => {
    Appeal.find().exec().then(elem => {
        res.status(200).json(elem);
    }).catch(err => {
        console.log(err);
        res.status(404).json({
            error: err
        });
    });
});

app.post('/fans-appeal', (req, res, next) => {
    const appeal = new Appeal({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        text: req.body.text,
        time: req.body.time,
        date: req.body.date
    });
    appeal.save().then(res => {
        console.log(res);
    }).catch(err => console.log(err));
    res.status(201).json({
        message: 'Appeal post success',
        newAppeal: appeal
    })
})

app.get('/tour-schedule', (req, res, next) => {
    res.status(200).json({
        message: 'Schedule page'
    });
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
