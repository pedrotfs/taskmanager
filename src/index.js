const express = require("express")
require("./db/mongoose")

const User = require("./models/user")
const Task = require("./models/task")

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post("/users", (req, res) => {
    const user = new User(req.body)
    
    user.save().then(() =>{
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get("/users", (req, res) => {
    User.find({}).then((result) => {
        res.send(result)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get("/users/:id", (req, res) => {
    User.findById(req.params.id).then((result) => {
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.post("/tasks", (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get("/tasks", (req, res) => {
    Task.find({}).then((result) => {
        res.send(result)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get("/tasks/:id", (req, res) => {
    Task.findById(req.params.id).then((result) => {
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.listen(port, () => {
    console.log("starting server on port " + port)
})