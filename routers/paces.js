var express = require('express');
var router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const Paces = require('../schemas/Paces');

// สร้างประวัติการเดิน
router.post('/paces', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var iss = jwt.verify(token, SECRET).iss;

    const payload = req.body;
    payload.userId = iss;
    const pace = new Paces(payload);

    // เช็คก่อนว่าบันทึกไว้แล้วหรือยัง
    const paced = await Paces.findOne({userId: iss, date: payload.date});
    if(paced) {
      return res.json({status: 409, message: 'pace is already saved.'});
    }

    await pace.save();
    res.json({status: 200, message: 'pace saved.'});
  } catch(error) {
    res.json({status: 204, message: error.message});
  }
});

// ดึงข้อมูลการเดินทั้งหมดของผู้ใช้ทุกคน
router.get('/paces', async(req, res) => {
  const paces = await Paces.find({});
  res.json(paces);
});

// ดึงข้อมูลการเดินของคนใดคนนึง (การเดินทั้งหมด)
router.get('/users/paces', async(req, res) => {
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
router.get('/users/paces/:format', async(req, res) => {
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

module.exports = router;