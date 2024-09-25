const isLogin = async (req,res,next)=>{
    try{
        if(req.session.user){
            next();
        }else{
            res.redirect("/");
        }
    }catch(err){
        console.error(err)
    }
}
const isLogout = async (req,res,next)=>{
    try{
        if(req.session.user){
            res.redirect("/home")
        }else{
            next();
        }
    }catch(err){
        console.error("err")
    }
}

module.exports = {
    isLogin,
    isLogout
}