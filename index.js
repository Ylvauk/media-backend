//packages
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require("helmet");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan(':date - :method (:url) :status - :response-time ms'));
app.use(helmet());
const { handleErrors } = require('./middleware/custom_errors');
app.use(handleErrors);

//port set
app.set('port', process.env.PORT || 8000);

//redirect
app.get('/', (req,res)=>{
    res.redirect('/posts')
})

//controllers
const usersController= require('./controllers/usersController');
app.use('/users',usersController)

const postsController= require('./controllers/postsController');
app.use('/posts',postsController)

const gamesController= require('./controllers/gamesController');
app.use('/games',gamesController)

//error handler
app.use((err, req, res, next)=>{
    const statusCode=res.statusCode || 500;
    const message=err.message || 'Internal Server Error'
    res.status(statusCode).send(message)
})

//listener
app.listen(app.get('port'), () => {
	console.log('connected to port');
})

module.exports = app;