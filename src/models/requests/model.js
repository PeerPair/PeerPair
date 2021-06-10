'use strict';

const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true }
});

const requestModel = mongoose.model('request', requestSchema);

module.exports = requestModel;
