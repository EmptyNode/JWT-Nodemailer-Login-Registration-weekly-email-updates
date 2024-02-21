const mongoose = require("mongoose");

const DB = 'mongodb+srv://emptynode:Mvd^hP=+VKDci8}@cluster0.fnotcvk.mongodb.net/logindetails?retryWrites=true';

mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("Database Connected"))
.catch((error)=>{
    console.log("error",error);
})