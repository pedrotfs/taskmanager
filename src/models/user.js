const mongoose = require("mongoose")
const validator = require("validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./task")

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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer //blob?
    }
},  {
    timestamps: true //ativa timestamps para criação e atualização
})

userScheme.virtual("tasks", {
    ref:"Task",
    localField: "_id",
    foreignField: "owner"
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
    return user
}

userScheme.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.TOKEN_SECRET)     
    user.tokens = user.tokens.concat({token: token})
    await user.save()
    return token
}

userScheme.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject() // remove informações do mongoose

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar // polui muito o json. já é fornecido via url pelo express

    return userObject
}

userScheme.pre("save", async function (next) {
    const user = this
    if(user.isModified("password")) {
        user.password = await bcryptjs.hash(user.password, 8)
    }
    next()
})

userScheme.pre("remove", async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model("User", userScheme)

module.exports = User