var express = require('express');
var router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const Users = require('../schemas/Users');

// สร้างผู้ใช้ใหม่
router.post('/users', async (req, res) => {
  try {
    const payload = req.body;
    // check if user is exists
    const existsUserName = await Users.findOne({username: payload.username});
    const existsUserEmail = await Users.findOne({email: payload.email});
    if(existsUserName || existsUserEmail) {
      res.json({ status: 204, message: 'username or email is exists' });
      return;
    }
    // hash raw password to md5
    payload.password = md5(payload.password);
    const user = new Users(payload);
    await user.save();
    res.json({ status: 200, message: 'user created' });
  } catch(error) {
    console.log(error.message);
  }
});

// การล็อกอิน
router.post('/login', async(req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({username: username, password: md5(password)});

  // check if user is in database
  if(!!user) {
    var token = jwt.sign({
      iss: user._id,
      username: user.username,
    }, SECRET);
    res.json({status: 200, message: 'login success', token});
  } else {
    res.json({status: 'error', message: 'user not found'});
  }
});

// ดึงข้อข้อมูลผู้ใช้ทั้งหมด
router.get('/users', async (req, res) => {
  const user = await Users.find({});
  res.json(user);
});

// ดึงข้อมูลผู้ใช้คนใดคนนึง
router.get('/users/me', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    const user = await Users.findOne({_id: iss});
    res.json({status: 200, user});
  } catch(error) {
    res.json({status: 204, message: 'invalid token', error: error});
  }
});

// แก้ไขข้อมูลของผู้ใช้
router.put('/users/me', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    const payload = req.body;
    await Users.findByIdAndUpdate(iss, {$set: payload});
    res.json({status: 200, message: 'update success'});
  } catch(error) {
    res.json({status: 204, message: 'can\'t update information'});
  }
});

// ค้นหาผู้ใช้จากชื่อ
router.get('/user/:username', async(req, res) => {
  try {
    const username = req.params.username;

    const user = await Users.findOne({username: username});
    if(user) {
      userDetails = {username: user.username, image: user.image}
      res.json({status: 200, userDetails});
    } else {
      res.json({status: 'error', message: 'username not found'});
    }
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

module.exports = router;