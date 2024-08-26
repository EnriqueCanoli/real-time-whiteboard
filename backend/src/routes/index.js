const {Router} = require("express")
const usersRouter = require("./usersRouters")

const router = Router()

router.use("/users", usersRouter)

module.exports = router