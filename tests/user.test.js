const request = require("supertest")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const app = require("../src/app")
const User = require("../src/models/user")

const userOneId = new mongoose.Types.ObjectId
const userOne = {
    "_id": userOneId,
    "name": "pedro1",
    "email": "p@p.com",
    "password": "123456",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.TOKEN_SECRET)
    }]
}

beforeEach(async () => { //antes de cada teste desse arquivo, deixando o banco no estado desejado para todos os testes
    await User.deleteMany()
    await new User(userOne).save()
})

test("create", async () => {
    const response = await request(app).post("/users").send({
        name: "pedro",
        email: "pedro@pedro.com",
        password: "123456"
    }).expect(201)
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user: {
            name:"pedro",
            email:"pedro@pedro.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("123456") //not plain text
})

test("update", async () => {
    const response = await request(app).patch("/users/me").set("Authorization", "Bearer " + userOne.tokens[0].token).send({
        name: "pedro2",
        email: "pedro2@pedro.com",
        password: "1234567"
    }).expect(201)
    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()
    expect(user.name).toBe("pedro2")
    expect(user.email).toBe("pedro2@pedro.com")
    expect(user.password).not.toBe("1234567") //not plain text
})

test("update fail", async () => {
    const response = await request(app).patch("/users/me").set("Authorization", "Bearer " + userOne.tokens[0].token).send({
        name: "pedro2",
        email: "pedro2",
        password: "1234567"
    }).expect(400)  
})

test("login", async () => {
    const response = await request(app).post("/users/login").send({
        email : userOne.email, 
        password: userOne.password
    }).expect(200)
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("fail login", async () => {
    await request(app).post("/users/login").send({
        email : userOne.email, 
        password: "123457"
    }).expect(500)
})

test("auth-profile", async () => {
    await request(app).get("/users/me").set("Authorization", "Bearer " + userOne.tokens[0].token).send().expect(200)
})

test("auth-profile fail", async () => {
    await request(app).get("/users/me").send().expect(401)
})

test("auth-delete", async () => {
    await request(app).delete("/users/me").set("Authorization", "Bearer " + userOne.tokens[0].token).send().expect(200)
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test("auth-delete fail", async () => {
    await request(app).delete("/users/me").send().expect(401)
})

test("upload picture", async () => {
    await request(app).post("/users/me/avatar").set("Authorization", "Bearer " + userOne.tokens[0].token)
    .attach("avatar","./tests/fixtures/profile-pic.jpg")
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})