const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const MYPACE_MONGODB = process.env.MYPACE_MONGODB;
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
var moment = require('moment-timezone');


// router
const usersRouter = require('./routers/users');
const advicesRouter = require('./routers/advices');
const pacesRouter = require('./routers/paces');
const badgesRouter = require('./routers/badges');
const leaderboardRouter = require('./routers/leaderboards');
const avatarsRouter = require('./routers/avatars');
const followingsRouter = require('./routers/followings');

mongoose.connect(MYPACE_MONGODB, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error', err);
});
app.use(express.json());
app.use(cors());
moment.locale('th')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/', usersRouter);
app.use('/', advicesRouter);
app.use('/', pacesRouter);
app.use('/b', badgesRouter);
app.use('/', leaderboardRouter);
app.use('/', avatarsRouter);
app.use('/', followingsRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`your server is running in http://localhost:${PORT}`);
});