const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatarsSchema = new Schema({
  image: String,
  description: String
}, { timestamps: true, versionKey: false });

const AvatarsModel = mongoose.model('Avatars', avatarsSchema);

module.exports = AvatarsModel;
