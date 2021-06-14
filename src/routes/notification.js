"use strict";
const express = require("express");
const bearerAuth = require("../auth/middleware/bearer");
const router = express.Router();
const noti = require("../models/notification/notification.js");
const generateID = require('../middleware/generateID');

//Routing methods
router.get("/myNotification/:id", bearerAuth,generateID, getNotification);



async function getNotification(req, res, next) {
  try {
    let paramsId = req.params.id;

    if (paramsId === req.userID) {

    const userNotification = await noti.findOne({user:req.userID});
    console.log(userNotification);
    console.log(userNotification.newMessages.length);
    const newMessages = [];

    for (let i = 0; i <= userNotification.newMessages.length; i++) {
        const element = userNotification.newMessages.pop();
        if(!element) break;
        userNotification.oldMessages.push(element);
        newMessages.push(element);
    }
    const newNotification = await noti.findOneAndUpdate({user:req.userID},userNotification);

    res.json({newMessages,all :newNotification.oldMessages});
    } else {
      throw new Error('access denied')
    }
  } catch (error) {
    next(error);
  }
}

module.exports = router;
