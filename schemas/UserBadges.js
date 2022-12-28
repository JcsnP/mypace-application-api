const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const user_badgesSchema = new Schema({
  badge_id: ObjectId,
  user_id: ObjectId
}, { timestamps: true, versionKey: false });

const UserBadgesModel = mongoose.model('User_Badges', user_badgesSchema);

module.exports = UserBadgesModel;
