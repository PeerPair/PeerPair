"use strict";
const express = require("express");
const DataCollection = require("../models/data-collection.js");
const RequestModel = require("../models/requests/model.js");
const request = new DataCollection(RequestModel);
const router = express.Router();

//Routing methods
router.get("/", getAllRequests);

async function getAllRequests(req, res, next) { 
  try {
    const query = req.body;
    const keywords = query.keyword.split(" ");
    const allRequestsData = await request.read();
    const catReq = allRequestsData.filter(obj=>{
        return obj.category === query.category;
    })
    let finalResponse = [];
    keywords.forEach(val=>{
        catReq.forEach(request => {
            if(request.keyword.includes(val)) {
                if(!finalResponse.includes(request)) finalResponse.push(request);
        }
        });
    })
    res.json(finalResponse);
  } catch (error) {
    next(error);
  }
}
//explore --> user ---> interests --- > [keywords]



module.exports = router;
