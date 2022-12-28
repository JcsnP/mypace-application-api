const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const pacesSchema = new Schema({
  user_id: ObjectId,
  date: String,
  details: {
    paces: Number,
    kcal: Number,
    distance: Number,
    mins: Number
  }
}, { timestamps: true, versionKey: false });

const PacesModel = mongoose.model('Paces', pacesSchema);

module.exports = PacesModel;
