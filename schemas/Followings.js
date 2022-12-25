const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const followingsSchema = new Schema({
  userId: ObjectId,
  followingId: ObjectId
}, { timestamps: true, versionKey: false });

const FollowingsModel = mongoose.model('Followings', followingsSchema);

module.exports = FollowingsModel;
