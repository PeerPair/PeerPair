"use strict";
const users = require('../auth/models/users');


module.exports=async (req,res,next)=>{
try{


    req.userID = req.user._id;
    next();
}catch(err){
    next(err)
}


}