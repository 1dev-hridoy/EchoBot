const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  city: String,
  country: String,
  lastLocationUpdate: Date,
  createdAt: Date
});

module.exports = mongoose.model('User', userSchema);