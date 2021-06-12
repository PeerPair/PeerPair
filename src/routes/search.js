"use strict";
const express = require("express");
const DataCollection = require("../models/data-collection.js");
const RequestModel = require("../models/requests/model.js");
const request = new DataCollection(RequestModel);
const router = express.Router();
const generateID = require('../middleware/generateID');
const bearerAuth = require("../auth/middleware/bearer");



//Routing methods
router.get("/search",bearerAuth, generateID, getAllRequests);

async function getAllRequests(req, res, next) { 
  try {
    const query = req.body;
    const keywords = query.keyword.split(" ");
    const allRequestsData = await request.get();
    const catReq = allRequestsData.filter(obj=>{
      console.log(obj);
        return (obj.user_ID !== req.userID && obj.category === query.category && !(obj.accepted)) ;
    })
    let finalResponse = [];  
    keywords.forEach(val=>{
        catReq.forEach(request => {
          let keyword;
          if(request.keyword) keyword = request.keyword.split(" ");
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
