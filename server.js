const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const MYPACE_MONGODB = process.env.MYPACE_MONGODB;
const md5 = require('md5');
const jwt = require('jsonwebtoken');
// var moment = require('moment');
var moment = require('moment-timezone');
const SECRET = process.env.SECRET;


// import schema
const Users = require('./schemas/Users');
const Paces = require('./schemas/Paces');
const Badges = require('./schemas/Badges');

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

// สร้างผู้ใช้ใหม่
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

// การล็อกอิน
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

// ดึงข้อข้อมูลผู้ใช้ทั้งหมด
app.get('/users', async (req, res) => {
  const user = await Users.find({});
  res.json(user);
});

// ดึงข้อมูลผู้ใช้คนใดคนนึง
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

// แก้ไขข้อมูลของผู้ใช้
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

// สร้างประวัติการเดิน
app.post('/paces', async(req, res) => {
  const payload = req.body;
  const pace = new Paces(payload);
  await pace.save();
  res.status(201).end();
});

// ดึงข้อมูลการเดินทั้งหมดของผู้ใช้ทุกคน
app.get('/paces', async(req, res) => {
  const paces = await Paces.find({});
  res.json(paces);
});

// ดึงข้อมูลการเดินของคนใดคนนึง (การเดินทั้งหมด)
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

// ดึงข้อมูลการเดินตามรูปแบบที่ต้องการ
// ทั้งหมด, สัปดาห์, วัน
app.get('/users/paces/:format', async(req, res) => {
  try {
    const { format } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    if(format === 'life') {
      const life = await Paces.find({userId: iss});
      let all = 0;
      life.map(item => {
        all += item.details.paces;
      })
      res.json({status: 200, all});
    }
    // res.json({format: format});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

// ดึงข้อมูล badge ของผู้ใช้คนใดคนนึง
app.get('/users/me/badges', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    const badge = await Users.findOne({_id: iss});
    res.json({status: 200, badges: badge.badges});
  } catch(error) {
    res.json({status: 'error', message: 'can\'t find user\'s badges'});
  }
});

// สร้าง badge
app.post('/badges', async(req, res) => {
  try {
    const payload = req.body;
    const badge = new Badges(payload);
    await badge.save();
    res.json({status: 201, message: 'create success'});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

// ดึงข้อมูล badge ทั้งหมด
app.get('/badges', async(req, res) => {
  try {
    const badges = await Badges.find({});
    if(!!badges) {
      res.json({status: 200, badges});
    } else {
      res.json({status: 204, message: 'no badges'});
    }
  } catch (error) {
    res.json({status: 'error', message: error.message});
  }
});


// ดึงข้อมูลการเดิน สัปดาห์ย้อนหลัง
app.get('/leaderboard', async(req, res) => {
  //  console.log(new Date(moment().subtract(1, 'days')).toLocaleDateString());
  try {
    const yesterday_date = await new Date(moment().subtract(1, 'days')).toLocaleDateString();
    const userPaces = await Paces.aggregate([
      {
        '$match': {'date': yesterday_date}
      },
      {
        '$lookup': {
          'from': Users.collection.name,
          'localField': 'userId',
          'foreignField': '_id',
          'as': 'user'
        }
      }
    ])
    .project({
      '_id': 0,
      'details': 1,
      'user.username': 1
    })
    .sort({'details.paces': -1})
    .limit(10)
    .exec();
    res.json({status: 200, userPaces});
  } catch(error) {
    res.json({status: 500, message: error});
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

/*
const allPaces = await Paces.find({})
    .where({date: moment().format('L')})
    .limit(10)
    .exec(function(error, result) {
      if(!error) {
        res.json({status: 200, result});
      } else {
        res.json({status: 204, message: error.message});
      }
    });
*/

/*
// leaderboard
app.get('/leaderboard', async(req, res) => {
  const allPaces = await Paces.find({})
    .limit(10)
    .sort({'details.paces': -1})
    .exec(function(error, result) {
      if(!error) {
        res.json({status: 200, result});
      } else {
        res.json({status: 204, message: error.message});
      }
    });
});
*/