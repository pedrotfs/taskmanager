const express = require("express")

const auth = require("./../middleware/auth")

const router = new express.Router()
const User = require("./../models/user")

router.post("/users", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post("/users/login", async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log(user)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(500).send()
    }
})

router.get("/users", auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.status(500).send()
    }
    
})

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
})

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        const user = await User.findById(req.params.id) //new retorna o usuário pós alteração
        updates.forEach((update) => { user[update] = req.body[update] })
        await user.save()
        if(!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send()
    }
})

router.delete("/users/:id", async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(e) {
        res.status(400).send()
    }
})

module.exports = router