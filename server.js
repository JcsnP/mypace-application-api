const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const MYPACE_MONGODB = 'mongodb+srv://mypaceadmin:mypaceadmin@cluster0.u4eefo2.mongodb.net/test';

// import schema
const User = require('./schemas/User');

mongoose.connect(MYPACE_MONGODB, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error', err);
});
app.use(express.json());
app.use(cors());

// create user
app.post('/user', async (req, res) => {
  const payload = req.body;
  const user = new User(payload);
  await user.save();
  res.status(201).end();
});

// get all user
app.get('/user', async (req, res) => {
  const user = await User.find({});
  res.json(user);
});

// get user details by id
app.get('/user/:id', async(req, res) => {
  const { id } = req.params;
  const user = await User.findOne({_id: id});
  res.json(user);
});

// update user by id
// update specific field, not all
app.put('/user/:id', async(req, res) => {
  const payload = req.body;
  const { id } = req.params;

  await User.findByIdAndUpdate(id, { $set: payload });
  res.status(200).end();
});

// delete user by id
app.delete('/user/:id', async(req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);
  res.status(204).end();
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`your server is running in http://localhost:${PORT}`);
});