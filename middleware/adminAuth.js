const isLogin = async (req,res,next)=>{
    try{
        if(req.session.userAdmin){
            next();
        }else{
            res.redirect("/admin");
        }
    }catch(err){
        console.error(err)
    }
}
const isLogout = async (req,res,next)=>{
    try{
        if(req.session.userAdmin){
            res.redirect("/admin/dashboard")
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