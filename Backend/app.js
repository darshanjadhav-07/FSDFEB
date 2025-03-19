const Express = require("express");
const BodyParser = require("body-parser");
const mongoDB = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const app = Express();
const PORT = process.env.PORT;



mongoDB.connect(`${process.env.MONGOURL}/ExampleDB`);


const userSchema = new mongoDB.Schema({
    email: String,
    password: String
});

const user = mongoDB.model("user", userSchema);

app.use(BodyParser.urlencoded({ extended: false }));

app.use(Express.json());


app.set("view engine", "ejs");


app.get("/signup", (req, res) => {
    res.render("index");
})

app.post("/signup", async(req, res) => {
    try{
        const Email = req.body.uEmail;
        const Password = req.body.uPassword;

        if(!Email || !Password){
            res.send("Please enter the fields");
        }
    
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(Password,salt);
    
        const newUser = new user({
            email: Email,
            password:hash
        });
    
        newUser.save();
    
        res.send("<h1>Signed up</h1>")
    }catch(error){
        res.status(500).send(error);
    }
   

})



app.post("/login", async (req, res) => {
    try{
        const Email = req.body.uEmail;
    const Password = req.body.uPassword;

    if (!Email || !Password) {
        // res.status(402).send("<h1>Please enter the fields</h1>");
        throw new error("Please enter the fields");
    }

    const userDetail = await user.findOne({ "email": Email });

    if(!userDetail){
        res.status(500).send("<h1>Please signup</h1>");
    }

    const comparePass = await bcrypt.compare(Password,userDetail.password);

    if(!comparePass){
        res.status(500).send("<h1>Password incorrect</h1>")
    }

    res.send("logged in");
    }
    catch(error){
        res.status(500).send(error);
    }

})


app.post("/forgotPassword",async(req,res)=>{
    try{
        const Email = req.body.uEmail;
    const Password = req.body.uPassword;

    const data = await user.findOne({ "email": Email });
    
    if(!data){
        res.status(500).send("<h1>Please signup</h1>");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(Password,salt);

    await user.updateOne({"email":data.email},{"password":hash});
    
     res.send({"Message":"Update success"});
    }
    catch(error){
        res.status(500).send(error);
    }
    

})



app.get("/", (req, res) => {
    res.send("<h1>This is nodeJS</h1>");
})

app.get("/about", (req, res) => {
    res.send("<h1>This is about page</h1>");
})

app.get("/contact", (req, res) => {
    res.send("<h1>This is contact page</h1>");
})

app.get("/forgotPassword",(req,res)=>{
    res.render("forgotPassword");
})

app.post("/contact", (req, res) => {
    res.send("<h1>Data sent</h1>");
})


app.listen(PORT, () => {
    console.log(`serving on port ${PORT}`);
})


