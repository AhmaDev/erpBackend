const jwt = require("jsonwebtoken");

module.exports.roles = function(role) {
   return function(req, res, next) {
      try {
         const token = req.headers.authorization.split(" ")[1];
         const decoded = jwt.verify(token, process.env.SECRET_KEY);
         if ((decoded.roleName != role) && (decoded.roleName != "REP ADMIN")) {
            throw new Error
         } else {
            next();
         }
      } catch (err) {
         return res.status(401).json({
            message: "auth failed"
         });
      }
   }
};