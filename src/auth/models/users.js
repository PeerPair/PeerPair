'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
  password: { type: String, required: true },
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  interests: {type: String},
  role: { type: String, required: true, default: 'user', enum: ['user', 'editor', 'admin','writer'] },
});

users.virtual('token').get(function () {
  let tokenObject = {
    userId: this._id,
  }
  return jwt.sign(tokenObject, process.env.SECRET)
});

users.virtual('capabilities').get(function () {
  let acl = {
    user: ['read'],
    writer: ['read','create'],
    editor: ['read', 'create', 'update'],
    admin: ['read', 'create', 'update', 'delete']
  };
  return acl[this.role];
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// BASIC AUTH
users.statics.authenticateBasic = async function (email, password) {
  const user = await this.findOne({ email })
  const valid = await bcrypt.compare(password, user.password)
  if (valid) { return user; }
  throw new Error('Invalid User');
}

// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, process.env.SECRET);
    const user = this.findOne({ _id: parsedToken.userId })
    if (user) { return user; }
    throw new Error("User Not Found");
  } catch (e) {
    throw new Error(e.message)
  }
}

users.read(_id) {
  if (_id) {
    return this.findOne({ _id });
  }
}


module.exports = mongoose.model('users', users);
