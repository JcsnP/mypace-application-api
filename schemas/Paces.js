const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pacesSchema = new Schema({
  userId: String,
  date: Date,
  details: {
    pace: String,
    kcal: Number,
    distance: Number,
    mins: Number
  }
}, { timestamps: true, versionKey: false });

const PacesModel = mongoose.model('Paces', pacesSchema);

module.exports = PacesModel;
