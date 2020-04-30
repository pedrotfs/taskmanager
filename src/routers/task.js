const express = require("express")
const router = new express.Router()
const auth = require("./../middleware/auth")

const Task = require("./../models/task")

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e) {
        res.status(500).send()
    }
})

router.get("/tasks/mine", auth, async (req, res) => {
    try {
        const tasks = await Task.find({owner: req.user._id})
        res.send(tasks)
    } catch(e) {
        res.status(500).send()
    }
})

router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id}) //garante que a task só é recuperada se usuario logado é dono
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id}) //new retorna o usuário pós alteração
        if(!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => { task[update] = req.body[update] })
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send()
    }
})

router.delete("/tasks/:id", auth, async(req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(400).send()
    }
})

module.exports = router