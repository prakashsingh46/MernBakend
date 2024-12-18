require('dotenv').config();
const mongoose =require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const employeeSchema= new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }],
})

// generate token
employeeSchema.methods.generateJwtToken= async function(){
    try{
        const tok =jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        console.log(tok);
        this.tokens = this.tokens.concat({token:tok});
        // console.log(this.tokens.token);
        await this.save();
        console.log("hello2");
        return tok;
    }
    catch (err) {
        console.error("The error part is: ", err);
        throw new Error("Token generation failed");
    }
    
}


employeeSchema.pre("save", async function(next){
    //during updation if password is also changed then only  hash it again
    if(this.isModified("password")){
        // console.log("current pass ",this.password);
        this.password=await bcrypt.hash(this.password, 10);
        // console.log("current password",this.password);

        this.confirmpassword=undefined; // dont need to store
    }

    next(); //to execute next commant i.e. save 
})

const Register= new mongoose.model("Register",employeeSchema);

module.exports=Register;