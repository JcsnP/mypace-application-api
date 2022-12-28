var express = require('express');
var router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const mongoose = require('mongoose');

const Users = require('../schemas/Users');
const Badges = require('../schemas/Badges');
const UserBadges = require('../schemas/UserBadges');

// ดึงข้อมูล badge ของผู้ใช้คนใดคนนึง
/*
router.get('/users/me/badges', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;

    const badge = await UserBadges.aggregate([
      {
        '$match': {'user_id': mongoose.Types.ObjectId(iss)}
      },
      {
        '$lookup': {
          'from': Badges.collection.name,
          'localField': 'badge_id',
          'foreignField': '_id',
          'as': 'badge'
        }
      },
      {
        '$unwind': '$badge'
      },
      {
        '$project': {
          'createdAt': 0,
          'updatedAt': 0,
          'badge._id': 0,
          'badge.createdAt': 0,
          'badge.updatedAt': 0,
        }
      }
    ]);
    res.json({status: 200, badges: badge});
  } catch(error) {
    res.json({status: 404, message: 'can\'t find user\'s badges', error: error.message});
  }
});
*/

// ดึงข้อมูล badge ของผู้ใช้คนใดคนนึง พร้อมสถานะ
/*
router.get('/users/me/badges', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;

    const badge = await Badges.aggregate([
      {
        '$lookup': {
          'from': UserBadges.collection.name,
          'localField': "_id",
          'foreignField': "badge_id",
          'as': "badge"
       }
      },
      {
        '$unwind': {'path': '$badge', 'preserveNullAndEmptyArrays': true}
      },
      {
        '$match': {
          '$or': [
            {'badge.user_id': mongoose.Types.ObjectId(iss)},
            {'badge': {'$exists': false}},
          ]
        }
      },
      {
        '$project': {
          '_id': 0,
          'createdAt': 0,
          'updatedAt': 0,
          'badge.createdAt': 0,
          'badge.updatedAt': 0,
        }
      }
    ])
    res.json({status: 200, badges: badge});
  } catch(error) {
    res.json({status: 404, message: 'can\'t find user\'s badges', error: error.message});
  }
});
*/

// สร้าง badge ของผู้ใช้คนใดคนนึง
router.post('/users/me/badges', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;
    const payload = req.body;
    // เช็คก่อนว่าปลดล็อกแล้วยัง
    if(await UserBadges.findOne({user_id: iss, badge_id: payload.badge_id})) {
      return res.json({status: 406, message: 'alreay unlocked'});
    }

    const badge = new UserBadges({user_id: iss, badge_id: payload.badge_id});
    await badge.save();
    res.json({status: 200, message: 'success'});
  } catch(error) {
    res.json({status: 404, message: 'can\'t find user\'s badges'});
  }
});

module.exports = router;