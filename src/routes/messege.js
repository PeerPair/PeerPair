"use strict";
const express = require("express");
const bearerAuth = require("../auth/middleware/bearer");
const router = express.Router();
const messege = require("../models/chat/messege.js");
const generateID = require('../middleware/generateID');
const room = require("../models/chat/room.js");


router.post("/messege/:id", bearerAuth,generateID, newMessge);

async function newMessge (req,res,next){
  let senderID = req.userID;
  let reciverID = req.params.id;
  let msgRoom = await room.find({users: { $in: [senderID, reciverID] }});
  console.log(msgRoom);
  if (msgRoom.length){
    res.send(msgRoom);
  }else {
    let newRoom = new room ({ users: [senderID, reciverID]});
    let roomRecord = await newRoom.save();
    res.send(roomRecord);
  }
}


module.exports = router;