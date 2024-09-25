const express = require("express");
const uRouter = express();
const path = require("path");
const session = require("express-session");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth")
const nocache = require("nocache");


uRouter.use(nocache());
uRouter.set("views",path.join(__dirname,"../views/user"));
uRouter.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}));

uRouter.get("/",auth.isLogout,userController.logPage);
uRouter.post("/register",userController.insertUser);
uRouter.post("/verify",userController.verifyLogin)
uRouter.get("/home",auth.isLogin,userController.homePage);
uRouter.post("/logout",userController.logout)
module.exports = uRouter
