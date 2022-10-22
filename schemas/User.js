const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  information: {
    age: Number,
    height: Number,
    weight: Number,
    gender: String
  }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;