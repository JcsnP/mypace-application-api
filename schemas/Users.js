const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const usersSchema = new Schema({
  username: String,
  email: String,
  password: String,
  information: {
    dob: String,
    height: Number,
    weight: Number,
    gender: String
  },
  badges: [ObjectId]
}, { timestamps: true, versionKey: false });

const UsersModel = mongoose.model('User', usersSchema);

module.exports = UsersModel;