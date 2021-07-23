"use strict";
const express = require("express");
const bearerAuth = require("../auth/middleware/bearer");
const router = express.Router();
const messege = require("../models/chat/messege.js");
const generateID = require('../middleware/generateID');
const room = require("../models/chat/room.js");


router.post("/messege/:id", bearerAuth,generateID, newMessge);
router.post("/old/:id", bearerAuth,generateID, loadMessages);

async function loadMessages(req,res){

  let senderID = req.userID;
  let roomID = req.params.id;
  let page=req.body.page;
  let roomOBJ = await room.findById(roomID);

  if(roomOBJ.users.includes(senderID)){
    const oldMessages = await messege.find({room_id:roomID}).limit(7).skip(page*7).sort({_id:-1})
    res.send(oldMessages)

  }else{
    res.send('access denied ')
  }




}


async function newMessge (req,res,next){
  console.log('hi');
  let senderID = req.userID;
  let reciverID = req.params.id;
  let msgRoom = await room.find({
    $or:[
    {users:  [senderID,reciverID] },
    {users:[reciverID,senderID]}
    
  ]});
  if (msgRoom.length){
    const oldMessages = await messege.find({room_id:msgRoom[0]._id}).limit(7).skip(0).sort({_id:-1})
    console.log(oldMessages);
    res.send({msgRoom:msgRoom[0],oldMessages:oldMessages.reverse()});
  }else {
    let newRoom = new room ({ users: [senderID, reciverID]});
    let roomRecord = await newRoom.save();

    res.send({msgRoom:roomRecord,oldMessages:[]});
  }
}


module.exports = router;