var express = require('express');
var router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const Avatars = require('../schemas/Avatars');

// เพิ่ม Avatar
router.post('/avatars', async(req, res) => {
  try {
    const payload = req.body;
    const avatar = new Avatars(payload);
    await avatar.save();
    res.json({status: 201, message: 'create success'});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

// ดึงข้อมูล Avatar ทั้งหมด
router.get('/avatars', async(req, res) => {
  try {
    const avatars = await Avatars.find({});
    res.json({status: 200, avatars});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

module.exports = router;