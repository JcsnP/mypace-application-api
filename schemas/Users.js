const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  username: String,
  email: String,
  password: String,
  information: {
    dob: String,
    height: Number,
    weight: Number,
    gender: String
  }
}, { timestamps: true, versionKey: false });

const UsersModel = mongoose.model('User', usersSchema);

module.exports = UsersModel;