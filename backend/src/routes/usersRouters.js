const {Router} = require("express")


const usersRouter = new Router()

usersRouter.get("/", (req, res)=>{res.json({message: 'You are in home'})})

module.exports = usersRouter