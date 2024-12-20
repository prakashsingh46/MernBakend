const jwt= require("jsonwebtoken");
const Register =require("../models/registers");

const auth = async( req, res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser= jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifyUser);
        const user=await Register.findOne({_id:verifyUser._id});
        // console.log(userData);
        req.user=user;
        req.token=token;
        next();
    } catch (error) {
        res.status(404).send(error);
    }
}

module.exports=auth; 