var express = require('express');
var router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const moment = require('moment');

const Users = require('../schemas/Users');
const Paces = require('../schemas/Paces');
const Following = require('../schemas/Followings');

// ดึงข้อมูลการเดิน สัปดาห์ย้อนหลังของเพื่อน
router.get('/leaderboard', async(req, res) => {
  // console.log(new Date(moment().subtract(7, 'days')).toLocaleDateString());
  try {
    let following= [];
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;

    // หาเพื่อนทั้งหมด
    let following_list = [];
    following = await Following.find({user_id: iss});
    following.map(item => {following_list.push(item.following_id)})

    // return res.json({user: {following}})
    const leaderboard = await Users.aggregate([
      {
        '$match': {
          '_id': {'$in': following_list}
        }
      },
      {
        '$project': {
          'email': 0,
          'password': 0,
          'information': 0,
          'createdAt': 0,
          'updatedAt': 0
        }
      },
      {
        '$lookup': {
          'from': Paces.collection.name,
          'localField': '_id',
          'foreignField': 'user_id',
          'as': 'pacesHistory'
        }
      },
      {
        '$unwind': '$pacesHistory'
      },
      {
        '$group': {
          '_id': '$_id',
          'username': {'$first': '$username'},
          'image': {'$first': '$image'},
          'totalPaces': {'$sum': '$pacesHistory.details.paces'}
        }
      },
      {
        '$sort': {'totalPaces': -1}
      }
    ])

    return res.json({status: 200, leaderboard});
  } catch(error) {
    console.log(error);
  }
});

module.exports = router;