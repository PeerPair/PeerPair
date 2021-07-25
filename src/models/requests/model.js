'use strict';

const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  user_ID: { type: String, default:'my-id'},
  submitters: {type: Array, required: true},
  keyword: { type: String, required: true },
  category: { type: String, required: true, enum: ['Study Group', 'Gaming', 'Sports', 'Traveling', 'Cooking'] },
  created_date: { type: String, required: true },
  description: { type: String, required: true },
   accepted: {type:Boolean, default:false },
   current_partner :{type:String,default:'none'},
   image: { type:String}
});
const requestModel = mongoose.model('request', requestSchema);

module.exports = requestModel;
