const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/employee",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("\x1b[32m%s\x1b[0m","connection successful....")
}).catch(()=>{
    console.log( "\x1b[31m%s\x1b[0m","Connection failed!")
});