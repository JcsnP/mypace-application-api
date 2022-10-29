const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const MYPACE_MONGODB = process.env.MYPACE_MONGODB;
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;


// import schema
const Users = require('./schemas/Users');
const Paces = require('./schemas/Paces');

mongoose.connect(MYPACE_MONGODB, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error', err);
});
app.use(express.json());
app.use(cors());

// =============== Users ===============
// create user
app.post('/users', async (req, res) => {
  const payload = req.body;
  // hash raw password to md5
  payload.password = md5(payload.password);
  const user = new Users(payload);
  await user.save();
  res.status(201).end();
});

// get all user
app.get('/users', async (req, res) => {
  const user = await Users.find({});
  res.json(user);
});

// get user details by id
app.get('/users/:id', async(req, res) => {
  const { id } = req.params;
  const user = await Users.findOne({_id: id});
  res.json(user);
});

// update user by id
// update specific field, not all
app.put('/users/:id', async(req, res) => {
  const payload = req.body;
  const { id } = req.params;

  await Users.findByIdAndUpdate(id, { $set: payload });
  res.status(200).end();
});

// delete user by id
app.delete('/users/:id', async(req, res) => {
  const { id } = req.params;

  await Users.findByIdAndDelete(id);
  res.status(204).end();
});

// =============== Paces ===============
// create pace
app.post('/paces', async(req, res) => {
  const payload = req.body;
  const pace = new Paces(payload);
  await pace.save();
  res.status(201).end();
});

// get all paces
app.get('/paces', async(req, res) => {
  const paces = await Paces.find({});
  res.json(paces);
});

// get paces by id

// update pace by id
// update specific field, not all

// delete pace by id

// =============== Get paces per Users ===============
// recieve user id, then show user information and all paces
app.get('/userPaces', async(req, res) => {
  const { id } = req.params;
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
    }
  ]).exec();

  res.json(userPaces);
});

// =============== Login ===============
app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({username: username, password: md5(password)});
  
  // check if user is in database
  if(!!user) {
    var token = jwt.sign({
      id: user._id,
      username: user.username,
      password: user.password,
      information: {
        dob: user.information.dob,
        height: user.information.height,
        weight: user.information.weight,
        gender: user.information.gender
      }
    }, SECRET);
    res.json({status: 'ok', message: 'login success', token, user});
  } else {
    res.json({status: 'error', message: 'user not found'});
  }
});

// =============== Authen ===============
app.post('/authen', async(req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var user = jwt.verify(token, SECRET);
    res.json({status: 'ok', user});
  } catch(error) {
    res.json({status: 'error', message: error.message});
  }
  
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`your server is running in http://localhost:${PORT}`);
});