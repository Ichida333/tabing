const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const userRoutes = require('./routes/userRoutes');
const User = require("./model/userModel")
const app = express();
const flash = require("connect-flash")

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

require('dotenv').config();



app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));





const sessionConfig = {
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));





const conn = process.env.DB_STRING;

mongoose.connect(conn)
.then( ()=> console.log("connection succesful"))
.catch( (err) => console.log(err))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


app.get('/', (req, res) => {
  res.render('home');
});

app.use('/users', userRoutes);

app.listen(5000, () => {
  console.log('ポート5000でリクエスト待受中...');
});
