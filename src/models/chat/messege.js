'use strict';

const mongoose = require('mongoose');

const messegeSchema = mongoose.Schema({
  messege:{type:String, required: true},
  sender_id: {type:String },
  sender_name: {type:String},
  room_id : {type:String},
  messege_time: {type:String}
});

module.exports = mongoose.model('messege', messegeSchema);
