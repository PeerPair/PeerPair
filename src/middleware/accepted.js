"use strict";

const DataCollection = require("../models/data-collection.js");
const RequestModel = require("../models/requests/model.js");
const request = new DataCollection(RequestModel);


module.exports=async (req,res,next)=>{
try{
    const requestData = await request.get(req.params.id);
    req.data = requestData;
    if(requestData.accepted){
        throw new Error('this request is accepted')
    }else{

        next();
    }
}catch(err){
    next(err)
}

function _authError() {
    res.status(403).send('Invalid Login');
  }
}