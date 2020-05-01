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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User" //referência outro model, exatamente como foi exportado
    }

}, {
    timestamps: true
})

const Task = mongoose.model("Task", taskScheme)

module.exports = Task