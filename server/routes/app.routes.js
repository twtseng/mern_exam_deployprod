const UserController = require("../controllers/user.controller")
const ItemController = require("../controllers/item.controller")
const LoginGithub = require("../controllers/login.github.controller")
const LoginGoogle = require("../controllers/login.google.controller")
const Login = require("../controllers/login.controller");
const { authenticate } = require("../config/jwt.config");

module.exports = app => {
    app.get("/api/users", UserController.getAllUsers);
    app.put("/api/users", UserController.addUser);
    app.delete("/api/users/:id", UserController.deleteUser);
    app.patch("/api/users/:id", UserController.updateUser);
    app.get("/api/items", ItemController.getAllItems);
    app.put("/api/items", ItemController.addItem);
    app.delete("/api/items/:id", ItemController.deleteItem);
    app.patch("/api/items/:id", ItemController.updateItem);
    app.get("/api/items/:id", ItemController.getItemById);
    app.put("/api/items/:id/subitem", ItemController.addSubItem);
    app.get("/login/github_redirect", LoginGithub.redirect);
    app.get("/login/github_login", LoginGithub.login);
    app.get("/login/google_redirect", LoginGoogle.redirect);
    app.get("/login/google_login", LoginGoogle.login);
    app.get("/login/getauthenticateduser", Login.getAuthenticatedUser);
    app.post("/login/logout", Login.logout);
    app.patch("/login/registeruser", Login.registerUser);
}