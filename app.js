require('dotenv').config()
const express =  require("express")
const app = express()
const PORT = 3000
const mongoose = require("mongoose")
const notFound = require('./middleware/notfound')
// const userRouter = require('./routes/userRoutes')
const newRouter = require('./routes/newUserRouter')
mongoose.set("strictQuery", true);


app.set('view engine', 'ejs')

//MIDDLEWARE
app.use(express.json())

//ROUTES
app.use(newRouter);
app.get("/signup", (req,res)=>{
    res.status(200).render("signup")
})
app.get("/login", (req,res)=>{
    res.status(200).render("login")
})
app.get("/dashboard", (req,res)=>{
    res.status(200).render("dashboard")
})
//ERROR ROUTE
app.use(notFound);

const start = async ()=> {
    try{await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT,() =>{
            console.log(`server running on port ${PORT}...`);
        });
        } catch (error) {console.log(error);}
    }

start()