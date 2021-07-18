'use strict';

const express = require('express');
const authRouter = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('./models/users.js');
const Noti = require('../models/notification/notification.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');
const generateID = require('../middleware/generateID');
authRouter.post('/signup', async (req, res, next) => {
  try {
    req.body.role = 'user';
    let user = new User(req.body);
    const userRecord = await user.save();
    const newNoti = new Noti({
      user: userRecord._id,
      newMessages: [],
      oldMessages: [],
    });
    const notiObj = await newNoti.save();
    const output = {
      userID: userRecord._id,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
  }
});

authRouter.put('/updateInfo/:id',bearerAuth,generateID, async (req, res, next) => {
  try {
    if(req.params.id === req.userID){
      let newInfo = req.body;
      console.log(req.params.id, newInfo);
      const userRecord = await User.findByIdAndUpdate(req.params.id, newInfo, {
        new: true,
      });
      console.log(userRecord);
      const output = {
        userID: userRecord,
      };
      res.status(201).json(output);

    }else{
      throw new Error('Access denied');
    }

  } catch (e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    userID: req.user._id,
    token: req.user.token,
  };
  res.status(200).json(user);
});

authRouter.get(
  '/users',
  bearerAuth,
  permissions('delete'),
  async (req, res, next) => {
    const users = await User.find({});
    const list = users.map((user) => user.email);
    res.status(200).json(list);
  }
);

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area');
});

module.exports = authRouter;
