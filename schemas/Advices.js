const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advicesSchema = new Schema({
  message: String
}, { timestamps: true, versionKey: false });

const AdvicesModel = mongoose.model('Advices', advicesSchema);

module.exports = AdvicesModel;
