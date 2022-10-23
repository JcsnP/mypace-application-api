const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pacesSchema = new Schema({
  userId: String,
  date: Date,
  details: {
    paces: Number,
    kcal: Number,
    distance: Number,
    mins: Number
  }
}, { timestamps: true, versionKey: false });

const PacesModel = mongoose.model('Paces', pacesSchema);

module.exports = PacesModel;
