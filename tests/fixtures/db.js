const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../../src/models/user")
const Task = require("../../src/models/task")

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    "_id": userOneId,
    "name": "pedro1",
    "email": "p@p.com",
    "password": "123456",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.TOKEN_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    "_id": userTwoId,
    "name": "pedro2",
    "email": "p@q.com",
    "password": "123456",
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.TOKEN_SECRET)
    }]
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "test task 2",
    complete: true,
    owner: userOne._id
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "test task 1",
    complete: false,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "test task 3",
    complete: false,
    owner: userTwo._id
}

const setupDB = async () => { //antes de cada teste desse arquivo, deixando o banco no estado desejado para todos os testes
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save() 
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDB
}
