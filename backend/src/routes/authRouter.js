const { Router } = require("express");
const authController = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authController.logout);

module.exports = authRouter;
