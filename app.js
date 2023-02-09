require('dotenv').config()
const express =  require("express")
const app = express()
const PORT = 4000
const mongoose = require("mongoose")
const notFound = require('./middleware/notfound')
// const userRouter = require('./routes/userRoutes')
const newRouter = require('./routes/newUserRouter')

const cookieparser = require('cookie-parser')

mongoose.set("strictQuery", true);


app.set('view engine', 'ejs')

//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieparser())

//ROUTES
app.use(newRouter);
app.get("/signup", (req,res)=>{
    res.status(200).render("signup")
})
app.get("/login", (req,res)=>{
    res.status(200).render("login")
})

//set cookies
app.get('/example', (req, res) => {
    res.cookie('isAdmin', true)
    //milliseconds
    res.cookie('another', false, {maxAge: 24 * 60 * 60 * 1000, secure: true, httpOnly: true,})

    res.send('cookies set')
})

app.get('/get', (req, res) => {
    const cookies = req.cookies
    const { isAdmin } = cookies 
    res.json(cookies)
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

