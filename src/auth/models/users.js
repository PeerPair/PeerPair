'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = new mongoose.Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  password: { type: String, required: true },
  email: {type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    interests: {type: String},
    age : {type: Number},
    user_bio: {type: String},
    location: {type: String},
    profile_image: {data: Buffer,
    contentType: String},
    education: {type: String},
  role: { type: String, default: 'user', enum: ['user', 'editor', 'admin'] },
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
    editor: ['read', 'create', 'update'],
    admin: ['read', 'create', 'update', 'deleteRequest']
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
users.statics.getUserIdFromToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, process.env.SECRET);
    return parsedToken.userId;
  } catch (e) {
    throw new Error(e.message)
  }
}

users.statics.read =async function(_id) {
  if (_id) {
    return await this.findOne({ _id });
  }
}


module.exports = mongoose.model('users', users);
