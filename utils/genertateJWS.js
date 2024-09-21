
const jwt = require('jsonwebtoken');


module.exports= async (payload)=>{


    return await jwt.sign({ email: payload.email, id: payload.id ,role:payload.role}, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

}

