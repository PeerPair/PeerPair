'use strict';

const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  user_ID: { type: String, default:'my-id'},
  submitters: {type: Array, required: true},
  keyword: { type: String, required: true },
  category: { type: String, required: true, enum: ['Study Group', 'Gaming', 'Sports', 'Traveling', 'Cooking'] },
  created_date: { type: String, required: true },
  description: { type: String, required: true },
});
const requestModel = mongoose.model('request', requestSchema);

module.exports = requestModel;
