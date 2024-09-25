const User = require("../models/userModel")
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    try {
      const pass = await bcrypt.hash(password, 10);
      return pass;
    } catch (error) {
      console.log(error.message);
    }
  };

const logPage = async (req, res) => {
    try {
        if(req.session.userExists){
            req.session.userExists = false;
            res.render("login",{
                message:"",
                errMessage:"user already exists"
            });
        }else if(
            req.session.regResult === true ||
            req.session.regResult === false
        ){
          if(req.session.regResult){
            req.session.regResult = null;
            res.render("login",{
                message:"registeration successfull",
                errMessage:""
            });
          }else{
            req.session.regResult = null;
            res.render("login",{
                message:"",
                errMessage:"registeration failed"
            });
          }
        }else if(req.session.isInvalid){
            req.session.isInvalid = false;
            res.render("login",{
                message:"",
                errMessage:"Invalid email or password"
            });
        }else if(req.session.noName){
            req.session.noName = false;
            res.render("login",{
                message:"",
                errMessage:"Username cannot be empty"
            });
        }
        else if(req.session.noUser){
            req.session.noUser = false;
            res.render("login",{
                message:"",
                errMessage:"user does not exixts. please sign up"
            });
        }else if(req.session.admin){
            req.session.admin = false;
            res.render("login",{
                message:"",
                errMessage:"Admin can't login"
            });
        }else{
            res.render("login",{
                message:"",
                errMessage:""
            });
        }
    } catch (err) {
        console.error(err);
    }
};
const insertUser = async (req,res)=>{
    try{
        if(req.body.username.trim()!==""){
            const isEmailExists = await User.findOne({email:req.body.email});
        if(isEmailExists){
            req.session.userExists = true;
            res.redirect("/");
        }else{
            const sPassword = await hashPassword(req.body.password);
            const user = new User({
                name : req.body.username,
                email : req.body.email,
                password : sPassword,
                isAdmin : false
            })
            const userData = await user.save();
            if(userData){
                req.session.regResult = true;
                res.redirect("/");
            }else{
                req.session.regResult = false;
                res.redirect("/");
            }
        }
        }else{
            req.session.noName = true;
            res.redirect("/")
        }
        
        
    }catch(err){
        console.error(err);
    }
}
const verifyLogin = async (req,res)=>{
    try{
        const isEmailExists = await User.findOne({email:req.body.email});
        if(isEmailExists){
            const passwordMath = await bcrypt.compare(req.body.password,isEmailExists.password)
           if(isEmailExists.isAdmin!== true){
            if(
                isEmailExists.email===req.body.email &&
                passwordMath===true
            ){
                req.session.user = isEmailExists.email;
                res.redirect("/home");
            }else{
                req.session.isInvalid = true;
                res.redirect("/");
            }
           }else if(isEmailExists.isAdmin === true){
            req.session.admin = true;
            res.redirect("/");
           }
        }else{
           req.session.noUser = true;
           res.redirect("/");
        }
    }catch(err){
        console.error(err);
    }
}
const homePage = async (req, res) => {
    try {
        if(req.session.user){
            res.render("home")
        }
    } catch (err) {
        console.error(err);
    }
};
const logout = async (req,res)=>{
    try{
        req.session.destroy()
        res.redirect("/")
    }catch(err){
        console.error(err);
    }
}
module.exports = {
    logPage,
    homePage,
    insertUser,
    verifyLogin,
    logout
}