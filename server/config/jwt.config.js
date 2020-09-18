const jwt = require("jsonwebtoken");
const config = require("./production.config");
const models = require("../models/models");

module.exports = {
  authenticate(req, res, next) {
    if (req.cookies.usertoken !== undefined) {
        console.log(`jwt.config req.cookies.usertoken = ${req.cookies.usertoken}`);
        jwt.verify(
        req.cookies.usertoken,
        config.SECRET_KEY,
        (err, payload) => {
            if (err) {
                res.status(401).json({
                    status: "failed",
                    errors: {
                        login_exception : { 
                            message : "You have not been authenticated"
                        } 
                    } 
                });
                return;
            }
        });
    } else {
        res.status(401).json({
            status: "failed",
            errors: {
                login_exception : { 
                    message : "You have not been authenticated"
                } 
            } 
        });
        return;
    }

    // User is authorized. Pass on the user to the next api
    next();
  },
};
