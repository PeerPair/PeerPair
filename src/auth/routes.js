'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./models/users.js');
const Noti = require('../models/notification/notification.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')
const permissions = require('./middleware/acl.js')

authRouter.post('/signup', async (req, res, next) => {
  try {
    console.log('hi');
    req.body.role = "user";
    let user = new User(req.body);
    const userRecord = await user.save();
    const newNoti = new Noti({user:userRecord._id , newMessages:[],oldMessages:[]});
    console.log(newNoti);
    const notiObj = await newNoti.save();
    console.log(notiObj);
    const output = {
      user: userRecord,
      token: userRecord.token,
      notification : notiObj
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  const users = await User.find({});
  const list = users.map(user => user.email);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area')
});

module.exports = authRouter;
