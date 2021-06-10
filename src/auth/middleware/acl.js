'use strict';

module.exports = (capability) => {

  return (req, res, next) => {

    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        next({status:403,message:'Access Denied'});
      }
    } catch (e) {
      next({status:403,message:'Invalid Login'});
    }

  }

}
