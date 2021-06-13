'use strict';

const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  users: {type: Array, required: true}
});

module.exports = mongoose.model('room', roomSchema);
