const {Router} = require("express")

const usersRouter = new Router()

usersRouter.get("/", (req, res)=>{res.status(200).send("Users get")})

module.exports = usersRouter