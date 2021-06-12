"use strict";
const express = require("express");
const DataCollection = require("../models/data-collection.js");
const RequestModel = require("../models/requests/model.js");
const users = require('../auth/models/users')
const request = new DataCollection(RequestModel);
const router = express.Router();
const generateID = require('../middleware/generateID');
const bearerAuth = require("../auth/middleware/bearer");


//Routing methods

router.get("/explore",bearerAuth,generateID, getAllRequests);   

async function getAllRequests(req, res, next) { 
  try {
    const allRequestsData =  await request.get();
    const user = await users.read(req.userID);
    console.log(user);
    const keywords = user.interests?user.interests.split(" "):[];
    let finalResponse = [];
    keywords.forEach(val=>{
        allRequestsData.forEach(request => {
          let keyword=[];
            if(request.keyword)  keyword = request.keyword.split(" ");
            if(keyword.includes(val)) {
                if(!finalResponse.includes(request)) finalResponse.push(request);
        }
        });
    })
    res.json(finalResponse);
  } catch (error) {
    next(error);
  }

}


module.exports = router;

