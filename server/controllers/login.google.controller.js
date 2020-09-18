const config = require("../config/production.config.js");
const axios = require("axios");
const models = require("../models/models");
const jwt = require("jsonwebtoken");

module.exports.OAUTH_SOURCE = "google"

module.exports.redirect = (req, result) => {
    const redirect_url = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile&access_type=offline&include_granted_scopes=true&response_type=code&client_id=${config.GOOGLE_OAUTH_ID}&redirect_uri=${config.PROD_URL}/login/google_login`
    console.log(redirect_url);
    result.redirect(redirect_url);
};

// Get user with this github login ID (or create if does not exist)
// If name or email is "UNINITIALIZED", render registration page on client app
module.exports.login = async (req, result) => {
    const code = req.query.code;
    const data = {
        "client_id" : config.GOOGLE_OAUTH_ID,
        "client_secret" : config.GOOGLE_OAUTH_KEY,
        "code" : code,
        "redirect_uri" : `${config.PROD_URL}/login/google_login`,
        'grant_type' : 'authorization_code'
    }
    
    try {
        // Get the access token
        let resp = await axios.post("https://oauth2.googleapis.com/token", data, {headers: { 'accept':'application/json'}})
        console.log(JSON.stringify(resp.data));
        /* Get the login info for the user with the oauthid of resp.data.id (if exists, else add new user)
        Exanple data in resp.data:

        */
        resp = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", { headers : { 'accept':'application/json', 'Authorization' : `Bearer ${resp.data.access_token}`}})
        console.log(JSON.stringify(resp.data));
        const user_filter = { oauth_source: module.exports.OAUTH_SOURCE, oauth_id: resp.data.id };
        console.log(`Searching for user: ${JSON.stringify(user_filter)}`);
        let user = await models.User.find(user_filter);
        console.log("User search result: "+JSON.stringify(user));
        if (user.length == 0) {
            // Create new user
            const new_user = { 
                name: resp.data.name ? resp.data.name : models.UNINITIALIZED, 
                email: resp.data.email ? resp.data.email : models.UNINITIALIZED,
                oauth_source: module.exports.OAUTH_SOURCE,
                oauth_id: resp.data.id
            };
            console.log(`Creating new user: ${JSON.stringify(new_user)}`);
            user = await models.User.create(new_user);
        } else if (user.length > 1) {
            result.status(400)
            .json({ 
                status: "failed", 
                errors: { 
                    github_login : { 
                        message : `Multiple google users found with id ${user_filter.oauth_id}`
                    } 
                }
            });
        } else {
            user = user[0];
        }
        const userToken = jwt.sign({ id: user._id }, config.SECRET_KEY);
        console.log("User: "+JSON.stringify(user));
        result
            .cookie("usertoken", userToken, { httpOnly: true})
            .cookie("displayname", user.getDisplayName())
            .cookie("username", user.name)
            .cookie("email", user.email)
            .redirect(config.CLIENT_LOGIN_PAGE);
    } catch (err) {
        console.log("google_login_catch_exception: "+JSON.stringify(err));
        result.status(400).json({
            status: "failed",
            errors: {
                github_login_catch_exception : { 
                    message : JSON.stringify(err)
                } 
            } 
        });
    }
};