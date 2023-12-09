import asyncHandler from 'express-async-handler'
import Admin from "../models/adminModel.js";
import generateToken from "../utils/generateToken.js";


const adminLogin = asyncHandler(async (req,res) => {
    
    const { email, password} = req.body;
    
    const user = await Admin.findOne({email})

    if(user && (await user.matchPassword(password))){
       const token =  generateToken(res,user._id);
        console.log(token);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token
        })
    }else{
        res.status(401)
        throw new Error('Invalid email or password')
    }
});



export {
    adminLogin,
}
