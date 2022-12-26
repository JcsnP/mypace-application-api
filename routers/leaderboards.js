var express = require('express');
var router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const Users = require('../schemas/Advices');
const Paces = require('../schemas/Paces');

// ดึงข้อมูลการเดิน สัปดาห์ย้อนหลัง
router.get('/leaderboard', async(req, res) => {
  //  console.log(new Date(moment().subtract(1, 'days')).toLocaleDateString());
  /*
    {
      '$match': {'date': yesterday_date}
    },
  */
  try {
    const yesterday_date = await new Date(moment().subtract(1, 'days')).toLocaleDateString();
    const userPaces = await Paces.aggregate([
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

module.exports = router;