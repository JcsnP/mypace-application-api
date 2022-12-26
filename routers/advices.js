var express = require('express');
var router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const Advices = require('../schemas/Advices');

// เพิ่มคำแนะนำ
router.post('/advices', async(req, res) => {
  try {
    const payload = req.body;
    if(await Advices.findOne({message: payload.message})) {
      return res.json({status: 409, message: 'advice is already exists'});
    }
    const advice = new Advices(payload);
    await advice.save();
    res.json({status: 201, message: 'create success'});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

// ดึงคำแนะนำทั้งหมด
router.get('/advices', async(req, res) => {
  try {
    const advices = await Advices.find({});
    const count = await Advices.count({});
    res.json({status: 200, count: count, advices});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

// สุ่มคำแนะนำ
router.get('/advice', async(req, res) => {
  try {
    Advices.count().exec((error, count) => {
      let random = Math.floor(Math.random() * count);
      Advices.findOne().skip(random).exec(
        (error, advice) => {
          res.json({status: 200, count: count, advice});
        }
      )
    })
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
});

module.exports = router;