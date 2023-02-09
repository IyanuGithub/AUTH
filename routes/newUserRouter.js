const router = require('express').Router()

const { register, login, logout} = require('../controller/newUser')
const requiredAuthProcess = require('../middleware/auth')



router.post('/register', register)
router.post('/login', login)
router.get("/dashboard", requiredAuthProcess, (req,res)=>{
    res.status(200).render("dashboard")
})
router.get('/logout', logout)
module.exports = router