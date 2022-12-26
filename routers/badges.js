var express = require('express');
var router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const Users = require('../schemas/Users');
const Badges = require('../schemas/Badges');

// ดึงข้อมูล badge ของผู้ใช้คนใดคนนึง
router.get('/users/me/badges', async(req, res) => {
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
router.post('/badges', async(req, res) => {
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
router.get('/badges', async(req, res) => {
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

module.exports = router;