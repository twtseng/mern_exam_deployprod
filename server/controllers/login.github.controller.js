const config = require("../config/production.config.js");
const axios = require("axios");
const models = require("../models/models");
const jwt = require("jsonwebtoken");

module.exports.OAUTH_SOURCE = "github"

module.exports.redirect = (req, result) => {
    const github_redirect_url = `https://github.com/login/oauth/authorize?client_id=${config.GITHUB_OAUTH_ID}&redirect_uri=${config.PROD_URL}/login/github_login`;
    console.log(github_redirect_url);
    result.redirect(github_redirect_url);
};

// Get user with this github login ID (or create if does not exist)
// If name or email is "UNINITIALIZED", render registration page on client app
module.exports.login = async (req, result) => {
    const code = req.query.code;
    const data = {
        "client_id" : config.GITHUB_OAUTH_ID,
        "client_secret" : config.GITHUB_OAUTH_KEY,
        "code" : code,
        "redirect_uri" : `${config.PROD_URL}/login/github_login`,
    }
    
    try {
        // Get the access token
        let resp = await axios.post("https://github.com/login/oauth/access_token", data, {headers: { 'accept':'application/json'}})

        /* Get the login info for the user with the oauthid of resp.data.id (if exists, else add new user)
        Exanple data in resp.data:
        {"login":"twtseng","id":8957670,"node_id":"MDQ6VXNlcjg5NTc2NzA=","avatar_url":"https://avatars0.githubusercontent.com/u/8957670?v=4",
        "gravatar_id":"","url":"https://api.github.com/users/twtseng","html_url":"https://github.com/twtseng",
        "followers_url":"https://api.github.com/users/twtseng/followers","following_url":"https://api.github.com/users/twtseng/following{/other_user}",
        "gists_url":"https://api.github.com/users/twtseng/gists{/gist_id}","starred_url":"https://api.github.com/users/twtseng/starred{/owner}{/repo}",
        "subscriptions_url":"https://api.github.com/users/twtseng/subscriptions","organizations_url":"https://api.github.com/users/twtseng/orgs",
        "repos_url":"https://api.github.com/users/twtseng/repos","events_url":"https://api.github.com/users/twtseng/events{/privacy}",
        "received_events_url":"https://api.github.com/users/twtseng/received_events","type":"User","site_admin":false,"name":null,
        "company":null,"blog":"","location":null,"email":null,"hireable":null,"bio":null,"twitter_username":null,"public_repos":6,
        "public_gists":0,"followers":0,"following":0,"created_at":"2014-09-29T11:31:34Z","updated_at":"2020-09-10T21:48:37Z"}
        */
        resp = await axios.get("https://api.github.com/user", { headers : { 'accept':'application/json', 'Authorization' : `token ${resp.data.access_token}`}})
        const user_filter = { oauth_source: module.exports.OAUTH_SOURCE, oauth_id: resp.data.id };
        console.log(`Searching for user: ${JSON.stringify(user_filter)}`);
        let user = await models.User.find(user_filter);
        console.log("User search result: "+JSON.stringify(user));
        if (user.length == 0) {
            // Create new user
            const new_user = { 
                name: models.UNINITIALIZED, 
                email: models.UNINITIALIZED,
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
                        message : `Multiple github users found with id ${user_filter.oauth_id}`
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
        console.log("github_login_catch_exception: "+JSON.stringify(err));
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