const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const badgesSchema = new Schema({
  title: String,
  description: String,
  picture: String,
  goal: Number,
  type: String
}, { timestamps: true, versionKey: false });

const BadgesModel = mongoose.model('Badges', badgesSchema);

module.exports = BadgesModel;
