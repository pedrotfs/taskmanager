const jwt = require("jsonwebtoken")
const User = require("./../models/user")


const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decode = jwt.verify(token, "secret")
        const user = await User.findOne({_id: decode._id, "tokens.token": token})
        if(!user) {
            throw new Error()
        }
        req.user = user
        req.token = token //current session
        next()
    } catch(e) {
        res.status(401).send({"error": "auth fail"})
    }
    
}

module.exports = auth