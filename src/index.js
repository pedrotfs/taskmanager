const express = require("express")
const jwt = require("jsonwebtoken")
require("./db/mongoose")

const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT || 3000
const maintenance = process.env.MAINTENANCE || false

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

app.listen(port, () => {
    console.log("starting server on port " + port)
})