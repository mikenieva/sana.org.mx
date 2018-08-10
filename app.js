require('dotenv').config();

const express      = require('express');
const path         = require('path');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const favicon      = require('serve-favicon');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
const hbs          = require('hbs');



mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost:27017/project-two', {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "lab-express-basic-auth",
  cooke: { maxAge: 60000},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}))

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


const authRoutes = require ('./routes/auth-routes');
const createProfile = require('./routes/createProfile');

app.use('/', authRoutes);
app.use('/signup', createProfile);

app.listen(3000);

const planeacionDeMenu = require('./routes/planeacionDeMenu');
app.use('/planeacionDeMenu', planeacionDeMenu);
module.exports = app;

