'use strict';

const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  user: {type: String, required: true},
  newMessages:{type: Array , required : true},
  oldMessages:{type: Array , required : true},
});

module.exports = mongoose.model('notification', notificationSchema);
