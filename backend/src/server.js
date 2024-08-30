const express = require("express")
const router = require("./routes")
const cors = require("cors")
const cookieParser = require('cookie-parser');

const app = express()

// Enable CORS for requests from http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,  // Allow cookies to be sent with requests
}));
//app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router)


module.exports = app