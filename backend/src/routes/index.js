const {Router} = require("express")
const usersRouter = require("./usersRouters")
const authRouter = require("./authRouter")
const autenticateMiddleware = require("../middlewares/authenticationToken")
const router = Router()

router.use("/users",autenticateMiddleware.authenticateToken, usersRouter)
router.use("/auth", authRouter)

module.exports = router