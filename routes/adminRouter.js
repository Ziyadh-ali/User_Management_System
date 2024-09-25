const express = require("express");
const aRouter = express();
const path = require("path");
const nocache = require("nocache")
const auth = require("../middleware/adminAuth")
const adminController = require("../controllers/adminController")

aRouter.set("views",path.join(__dirname,"../views/admin"));

aRouter.use(nocache())

aRouter.get("/",auth.isLogout,adminController.loadLogin)
aRouter.post("/verifyAdmin",adminController.verifyLogin)
aRouter.post("/insertUser",adminController.addUser)
aRouter.get("/dashboard",auth.isLogin,adminController.loadHome)
aRouter.post("/search",adminController.searchUser)
aRouter.get("/search",adminController.searchUser)
aRouter.get("/editUser/:id",adminController.editView)
aRouter.put("/editUser/:id",adminController.editUser)
aRouter.delete("/deleteUser/:id",adminController.delUser)
aRouter.get("/addUser",adminController.loadAddUser)
aRouter.post("/logout",adminController.logout)

module.exports = aRouter;