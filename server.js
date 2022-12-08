const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const MYPACE_MONGODB = process.env.MYPACE_MONGODB;
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;


// import schema
const Users = require('./schemas/Users');
const Paces = require('./schemas/Paces');

mongoose.connect(MYPACE_MONGODB, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error', err);
});
app.use(express.json());
app.use(cors());

 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// =============== Users ===============
// create user
app.post('/users', async (req, res) => {
  try {
    const payload = req.body;
    // check if user is exists
    const existsUser = await Users.findOne({username: payload.username});
    if(existsUser) {
      res.json({ status: 'error', message: 'username is exists' });
      return;
    }
    // hash raw password to md5
    payload.password = md5(payload.password);
    const user = new Users(payload);
    await user.save();
    res.json({ status: 'ok', message: 'user created' });
  } catch(error) {
    console.log(error.message);
  }
});

// =============== Login ===============
app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({username: username, password: md5(password)});
  
  // check if user is in database
  if(!!user) {
    var token = jwt.sign({
      iss: user._id,
      username: user.username,
    }, SECRET);
    res.json({status: 'ok', message: 'login success', token});
  } else {
    res.json({status: 'error', message: 'user not found'});
  }
});

// get all user
app.get('/users', async (req, res) => {
  const user = await Users.find({});
  res.json(user);
});

// get user details by id
app.get('/users/me', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    const user = await Users.findOne({_id: iss});
    res.json({status: 'ok', user});
  } catch(error) {
    res.json({status: 'error', message: 'invalid token'});
  }
});

// =============== Paces ===============
// create pace
app.post('/paces', async(req, res) => {
  const payload = req.body;
  const pace = new Paces(payload);
  await pace.save();
  res.status(201).end();
});

// get all paces
app.get('/paces', async(req, res) => {
  const paces = await Paces.find({});
  res.json(paces);
});

// get user's paces
app.get('/users/paces', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    const userPaces = await Paces.find({userId: iss});

    // response to client
    res.json({status: 200, history: userPaces});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

// =============== Update ===============
app.put('/users/me', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    const payload = req.body;
    await Users.findByIdAndUpdate(iss, {$set: payload});
    res.json({status: 'ok', message: 'update success'});
  } catch(error) {
    res.json({status: 'error', message: 'can\'t update information'});
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`your server is running in http://localhost:${PORT}`);
});

/*
app.get('/users/paces', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    const userPaces = await Users.aggregate([
      {
        "$addFields": {
          "_id": {
            "$toString": "$_id"
          }
        }
      },
      {
        '$lookup': {
          'from': Paces.collection.name,
          'localField': '_id',
          'foreignField': 'userId',
          'as': 'history'
        }
      },
      {
        "$match": {
          "_id": iss
        }
      }
    ]).exec();

    // response to caller
    res.json(userPaces);
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});
*/