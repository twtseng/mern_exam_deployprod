const jwt = require("jsonwebtoken");
const config = require("../config/production.config");
const models = require("../models/models");

module.exports.getAuthenticatedUser = (req, result) => {
    // Get the info for the logged in user (if any)
    if (req.cookies.usertoken === undefined) {
        console.log("getAuthenticatedUser usertoken is undefined");
        let returnObj = {
            name: "not logged in",
            email: "not logged in",
            oauth_source: "not logged in",
            oauth_id: "not logged in",
            displayname: "not logged in",
        }
        result.json({
            status: "succeeded",
            message: `not logged in`,
            result: returnObj
        });
    } else {
        let usertoken = jwt.decode(req.cookies.usertoken);
        console.log("getAuthenticatedUser usertoken = "+req.cookies.usertoken);
        models.User.findById(usertoken.id)
        .then(user => {
            let returnObj = {
                name: user.name,
                email: user.email,
                oauth_source: user.oauth_source,
                oauth_id: user.oauth_id,
                displayname: user.getDisplayName(),
            }
            console.log("found user: "+JSON.stringify(user));
            result
            .cookie("displayname", user.getDisplayName())
            .cookie("username", user.name)
            .cookie("email", user.email)
            .json({
                status: "succeeded",
                message: `getAuthenticatedUser succeeded`,
                result: returnObj
            });
        })
        .catch(err => {
            console.log("login_catch_exception: "+JSON.stringify(err));
            result.status(400).json({
                status: "failed",
                errors: {
                    login_catch_exception : { 
                        message : JSON.stringify(err)
                    } 
                } 
            });
        });
    }
};
module.exports.logout = (req, result) => {
    console.log("user.logout");
    result.clearCookie("usertoken");
    result.clearCookie("displayname");
    result.clearCookie("username");
    result.clearCookie("email");
    result.json({
        status: "succeeded",
        message: `user logged out`,
        result: null
    });
}
module.exports.registerUser = (req, result) => {
    let userId = null;
    if (req.body._id) {
        console.log("registerUser id passed manually, id="+req.body._id);
        userId = req.body._id;
    } else if (req.cookies.usertoken === undefined) {
        console.log("register usertoken is undefined");
        result.status(401).json({
            status: "failed",
            errors: {
                not_authenticated : { 
                    message : "You are not authenticated"
                } 
            } 
        });
        return;
    } else {
        let usertoken = jwt.decode(req.cookies.usertoken);
        userId = usertoken.id
    }
    models.User.findOneAndUpdate({ _id: userId }, req.body, { runValidators: true, useFindAndModify: false })
    .then(user => 
        result.json(
        { status: "succeeded"
        , message: `registerUser succeeded`
        , result: req.body}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};