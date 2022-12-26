var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const Users = require('../schemas/Users');
const Followings = require('../schemas/Followings');

// ติดตามคนอื่น
router.post('/followings', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    const payload = req.body;

    // ค้นหาก่อนว่ามีผู้ใช้คนนั้นมั้ย
    const user = await Users.findOne({username: payload.following_name});
    if(!user) {
      res.json({status: 404, message: 'user not found'});
      return;
    }

    payload.userId = iss;
    payload.followingId = user._id;

    const followings = new Followings(payload);
    await followings.save();

    res.json({status: 200, message: 'create success'});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

// ดูข้อมูลการติดตามของผู้ใช้คนนั้นๆ
router.get('/followings', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    // const followings = await Followings.find({userId: iss});

    const followings = await Followings.aggregate([
      {
        '$match': {
          'userId': mongoose.Types.ObjectId(iss)
        }
      },
      {
        '$lookup': {
          'from': Users.collection.name,
          'localField': 'followingId',
          'foreignField': '_id',
          'as': 'details'
        }
      },
      {
        '$project': {
          '_id': 0,
          'details.username': 1,
          'details.image': 1
        }
      }
    ])

    res.json({status: 200, followings});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

module.exports = router;