const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const ExpressError = require('./utils/ExpressError');
const LocalStrategy = require('passport-local');
const Joi = require("joi")
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require("./routes/tripRoutes")
const planRoutes = require("./routes/planRoutes")
const User = require("./model/userModel")
const methodOverride = require('method-override');
const app = express();
const flash = require("connect-flash")
const fileUpload = require('express-fileupload');
const path = require('path');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

require('dotenv').config();



app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));

app.use(
  fileUpload({
    useTempFiles: true
  })
);

// 静的ファイルの提供 (アップロードされた画像の表示のため)
app.use(express.static(path.join(__dirname, 'uploads')));




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
  
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


app.get('/', (req, res) => {
  res.render('home');
});

app.use('/users', userRoutes);
app.use('/trip', tripRoutes);
app.use('/plan', planRoutes);

app.all('*', (req, res, next) => {
  next(new ExpressError('ページが見つかりませんでした', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
      err.message = '問題が起きました'
  }
  res.status(statusCode).render('error', { err });
});

app.listen(5000, () => {
  console.log('ポート5000でリクエスト待受中...');
});
