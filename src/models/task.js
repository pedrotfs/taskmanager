const mongoose = require("mongoose")

const taskScheme = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    complete: {
        type: Boolean,
        default: false
    }
})

const Task = mongoose.model("Task", taskScheme)

module.exports = Task