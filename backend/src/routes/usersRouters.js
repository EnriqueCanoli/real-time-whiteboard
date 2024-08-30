const {Router} = require("express")


const usersRouter = new Router()

usersRouter.get("/", (req, res)=>{res.json({message: 'This is a protected route', user: req.user})})

module.exports = usersRouter