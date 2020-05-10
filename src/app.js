const express = require("express")
const jwt = require("jsonwebtoken")
require("./db/mongoose")

const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()
const maintenance = process.env.MAINTENANCE === "true" || false

app.use((req, res, next) => {
    if(maintenance) {
        res.status(503).send("WE ARE UNDER MAINTENANCE")
    } else {
        next()
    }
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app