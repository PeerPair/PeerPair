"use strict";
const express = require("express");
const DataCollection = require("../models/data-collection.js");
const RequestModel = require("../models/requests/model.js");
const users = require('../auth/models/users')
const request = new DataCollection(RequestModel);
const router = express.Router();

//Routing methods
router.get("/explore", getAllRequests);

async function getAllRequests(req, res, next) { 
  try {
    if (!req.headers.authorization) { _authError() }
    const token = req.headers.authorization.split(' ').pop();
    const userID = await users.getUserIdFromToken(token);
    console.log(userID);
    const allRequestsData =  await request.get();
    const user = await users.read(userID);
    const keywords = user.interests.split(" ");
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
  function _authError() {
    res.status(403).send('Invalid Login');
  }
}
//explore --> user ---> interests --- > [keywords]



module.exports = router;

