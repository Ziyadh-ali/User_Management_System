const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override")


//middlewares//

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride("_method"));


//connect to mongoDB//
mongoose.connect("mongodb://localhost:27017/user_management");
//check//
const db = mongoose.connection;
db.on("error",(err)=>console.error(err));

//routes//
const userRouter = require("./routes/userRouter");
app.use('/',userRouter);

const adminRouter = require("./routes/adminRouter");
app.use('/admin',adminRouter)

app.get("*",(req,res)=>{
    res.render("404")
})

//server//
app.listen(3000,()=>console.log("server is running in http://localhost:3000"));