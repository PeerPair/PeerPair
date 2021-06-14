"use strict";
const express = require("express");
const bearerAuth = require("../auth/middleware/bearer");
const router = express.Router();
const generateID = require('./generateID');
const room = require("../models/chat/room.js");



module.exports = async function (req,res,next){
  let senderID = req.userID;
  let reciverID = req.params.id;
  let msgRoom = await room.find({users: { $in: [senderID, reciverID] }});
  if (msgRoom.length){
    req.roomID = msgRoom[0]._id;
  }else {
    let newRoom = new room ({ users: [senderID, reciverID]});
    let roomRecord = await newRoom.save();
    req.roomID = roomRecord._id;
  }
  next();
}


