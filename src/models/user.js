const mongoose = require("mongoose")
const validator = require("validator")
const bcryptjs = require("bcryptjs")

const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if(value < 18) {
                throw new Error("Age must be higher than 18")
            }
        }
    },
    password: {
        type: String,
        minlength: 6,
        trim: true,
        required: true,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error("contains password")
            }
        }
    }
})

userScheme.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email})
    if(!user) {
        throw new Error("unable to login (1)")
    }    
    const match = await bcryptjs.compare(password, user.password)
    if(!match) {
        throw new Error("unable to login (2)")
    }
    console.log(user)
    return user
}

userScheme.pre("save", async function (next) {
    const user = this
    if(user.isModified("password")) {
        user.password = await bcryptjs.hash(user.password, 8)
    }
    next()
})


const User = mongoose.model("User", userScheme)

module.exports = User