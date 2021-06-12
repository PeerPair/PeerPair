"use strict";
const users = require('../auth/models/users');


module.exports=async (req,res,next)=>{
try{

    if (!req.headers.authorization) { _authError() }
    const token = req.headers.authorization.split(' ').pop();
    const userID = await users.getUserIdFromToken(token);
    req.userID = userID;
    next();
}catch(err){
    next(err)
}

function _authError() {
    res.status(403).send('Invalid Login');
  }
}