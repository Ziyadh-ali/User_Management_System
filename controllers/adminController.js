const User = require("../models/userModel")
const bcrypt = require("bcrypt");

const loadLogin = async (req,res)=>{
    try{
        if(req.session.invalid){
            req.session.invalid = false
            res.render("login",({
                msg:"",
                emsg:"Invalid email or password"
            }))
        }else if(req.session.isUser){
            req.session.isUser = false;
            res.render("login",({
                msg:"",
                emsg:"You are not a admin"
            }))
        }
        else{
            res.render("login",({
                msg:"",
                emsg:""
            }))
        }
    }catch(err){
        console.error(err);
    }
}

const verifyLogin = async (req,res)=>{
    try{
        const isEmailExists = await User.findOne({email:req.body.email});
        if(isEmailExists){
            const passwordMatch = await bcrypt.compare(req.body.password,isEmailExists.password);
            if(isEmailExists.isAdmin !== false){
                if(
                    isEmailExists.email === req.body.email &&
                    passwordMatch === true
                ){
                    req.session.userAdmin = true;
                    res.redirect("/admin/dashboard")
                }else{
                    req.session.invalid = true
                    res.redirect("/admin")
                }
            }else{
                req.session.isUser = true
                res.redirect("/admin")
            }
        }else{
            res.redirect("/admin")
        }
    }catch(err){
        console.error(err);
    }
}
const loadHome = async (req,res)=>{
    try{
       
         const users = await User.find({});
         res.render("home",({
            users:users
         }))
        
    }catch(err){
        console.error(err);
    }
}
const addUser = async (req,res)=>{
    try{ 
        if(req.body.username.trim()!==""){
            const isEmailExists = await User.findOne({email:req.body.email});
            if(isEmailExists){
                req.session.userExists = true;
                res.redirect("/admin/addUser");
            }else{
                const sPassword = await bcrypt.hash(req.body.password,10);
                const user = new User({
                    name : req.body.username,
                    email : req.body.email,
                    password : sPassword,
                    isAdmin : false
                })
                const userData = await user.save();
                if(userData){
                    req.session.addResult = true;
                    res.redirect("/admin/addUser");
                }else{
                    req.session.addResult = false;
                    res.redirect("/admin/addUser");
                }
            }
        }else{
            req.session.noName = true
            res.redirect("/admin/addUser")
        }
        
        
       
        
        
    }catch(err){
        console.error(err);
    }
}
const loadAddUser = async (req,res)=>{
    try{
        if(req.session.addResult){
            req.session.addResult = null;
            console.log("user added")
            res.render("addUser",{
                msg:"User added successfully",
                emsg:""
            })
        }else if(req.session.addResult = false){
            req.session.addResult = null;
            res.render("addUser",{
                msg:"",
                emsg:"Error in adding"
            })
        }else if(req.session.noName){
            req.session.noName = false;
            res.render("addUser",{
                msg:"",
                emsg:"Username cannot be empty"
            })
        }else if(req.session.userExists){
            req.session.userExists = false;
            res.render("addUser",{
                msg:"",
                emsg:"User already exists"
            })
        }else if(req.session.userAdmin){
            res.render("addUser",{
                msg:"",
                emsg:""
            })
        }else{
            res.redirect("/admin")
        }
    }catch(err){
        console.error(err);
    }
}
const searchUser = async (req,res)=>{
    try{
        const searchName = req.body.search;
        const searchChar = await searchName.replace(/[^a-zA-Z0_9 ]/g,"");
        const users = await User.find({
            name: {$regex: new RegExp(searchChar, "i")}
        })
         res.render("search",({
            users:users
         }))
    }catch(err){
        console.error(err);
    }
}
const showUser = async (req,res)=>{
    try{
        const user = await User.find({_id:req.params.id})
        res.render("search",{
            users:user
        })
    }catch(err){
        console.error(err);
    }
}
const editView = async (req, res) => {
    try {
        const userData = await User.findOne({_id: req.params.id});
        if(req.session.is_EmailExists) {
            req.session.is_EmailExists = false;
            return res.render("edit", {
                msg: "",
                emsg: "Email already Exists",
                user: userData
            });
        }
        res.render("edit", {
            msg: "",
            emsg: "",
            user: userData
        });
    } catch(err) {
        console.error(err);
    }
}

const editUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.send("User not found");
        }
        let emailChanged = false;
        if(req.body.email && req.body.email !== user.email) {
            emailChanged = true;
        }
        if(emailChanged) {
            const userExists = await User.findOne({email: req.body.email});
            if(userExists) {
                req.session.is_EmailExists = true;
                return res.redirect(`/admin/editUser/${req.params.id}`);
            }
        }
        const updateFields = {};
        if (req.body.username) updateFields.name = req.body.username;
        if (emailChanged) updateFields.email = req.body.email; // Email changed but not exists in db
            updateFields.updatedAt = Date.now();

            await User.findByIdAndUpdate(req.params.id, updateFields);
            res.redirect("/admin/dashboard");
       
    } catch(err) {
        console.error(err);
    }
}
const delUser = async (req,res)=>{
    try{
        
        const del =  await User.deleteOne({_id:req.params.id})
        
        res.redirect("/admin")
    }catch(err){
        console.error(err);
    }
}
const logout = async (req,res)=>{
    try{
        req.session.destroy()
        res.redirect("/admin")
    }catch(err){
        console.error(err);
    }
}

module.exports = {
    loadLogin,
    loadHome,
    verifyLogin,
    logout,
    loadAddUser,
    addUser,
    searchUser,
    editView,
    editUser,
    delUser
}