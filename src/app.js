
const express=require("express");
const bcrypt=require("bcryptjs");
const app = express();
const path= require("path");
const Register =require("./models/registers")

const hbs= require("hbs")

require("./db/connection")
const port =process.env.PORT || 3000

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../template/views");
const partial_path=path.join(__dirname,"../template/partials");

app.use(express.json())
app.use(express.urlencoded({extended:false})) //to get data from form

app.use(express.static(static_path));
app.set("view engine","hbs")
app.set("views",template_path);
hbs.registerPartials(partial_path)

app.get("/", (req, res)=>{
    res.render("home")
})
app.get("/register", (req, res)=>{
    res.render("register")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.post("/login", async(req,res)=>{
    const eml=req.body.email;
    const pass=req.body.password;
    try{
        const ver = await Register.findOne({'email':eml});
        const comp= await bcrypt.compare(pass, ver.password);
        if(comp){
            res.send(`You are successfully logged in! \n welcome ${ver.firstname}`)
        }
        else {
            res.send("Incorrect Email or password!");
        }

    }catch(err){
        res.send(err);
    }
})
app.post("/register",async(req, res)=>{
    console.log(req.body)
    try{
        const pass = req.body.password;
        const confirmPass = req.body.confirmPassword;
        if(pass===confirmPass){
            const registerEmployee=new Register({
                firstname : req.body.firstName,
                lastname : req.body.lastName,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : req.body.password,
                confirmpassword : req.body.confirmPassword
            })
            const token = await registerEmployee.generateJwtToken();
            console.log("hello1");
            // console.log(token);
            const create = await registerEmployee.save();

            res.status(200).send("Registration successful..");
        }
        else{
            res.send("passwords are not matching")
        }
    }catch(er){
        res.status(400).send(er)
    }
})
app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})