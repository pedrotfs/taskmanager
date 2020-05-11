const request = require("supertest")
const Task = require("../src/models/task")
const app = require("../src/app")
const {userOne, userOneId, setupDB, userTwo, userTwoId, taskOne, taskTwo} = require("./fixtures/db")

beforeEach(setupDB)

test("create task", async () => {
    const response = await request(app).post("/tasks").set("Authorization", "Bearer " + userOne.tokens[0].token).send({
        description: "test task"
    }).expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.complete).toBe(false)
}) 

test("get user task", async () => {
    const response = await request(app).get("/tasks/mine").set("Authorization", "Bearer " + userOne.tokens[0].token).send().expect(200)
    expect(response.body.tasks).not.toBeNull()
    expect(response.body.length).toBe(2)    
}) 

test("remove user task from other user", async () => {
    const response = await request(app).delete("/tasks/" + taskOne._id).set("Authorization", "Bearer " + userTwo.tokens[0].token).send().expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
}) 