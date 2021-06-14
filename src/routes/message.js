"use strict";
const express = require("express");
const bearerAuth = require("../auth/middleware/bearer");
const router = express.Router();
const generateID = require('../middleware/generateID');
const roomID = require('../middleware/roomID');



router.post('/msg/:id',bearerAuth,generateID,roomID,openConv)

async function openConv(req,res){
    res.redirect(`/room/${req.roomID}`);
}

module.exports=router;