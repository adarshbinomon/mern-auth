import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

//@desc Auth user/set token
//route POST /api/users/auth
// @access Public

const authUser = asyncHandler(async (req,res) => {
    const { email, password} = req.body;
    
    const user = await User.findOne({email})

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


//@desc Register a new  user
//route POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        generateToken(res,user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});



//@desc Logout user
//route POST /api/users/logout
// @access Public

const logoutUser = asyncHandler(async (req,res) => {
    res.clearCookie('jwt').status(200).json({ message: 'User logged out' });

    res.status(200).json({message: 'User logged out'})    
});


//@desc GET user profile
//route GET /api/users/profile
// @access Private

const getUserProfile = asyncHandler(async (req,res) => {
    console.log('test');
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json(user)
});

//@desc Update user profile
//route PUT /api/users/profile
// @access Private

const updateUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if(req.body.password) {
            user.password = req.body.password
        }

        const upadatedUser = await user.save();

        res.status(200).json({
            _id: upadatedUser._id,
            name: upadatedUser.name,
            email: upadatedUser.email 
        })
    }else{
        res.status(404);
        throw new Error('User not found')
    }
});

//@desc update profile picture
//route POST /api/users/upload-image
//@access private

const updateProfilePicture = asyncHandler(async (req,res) =>{
    console.log('ttt');
    await User.updateOne(
      { email: req.body.email },
      { $set: { profilePicture: req.file.filename } },
      { upsert: true }
    )
    const user = await User.findOne({email: req.body.email}).exec()
    const token = req.headers.authorization
    console.log(user.profilePicture);
    res.json({ _id: user._id, name: user.name, email: user.email,image:user.profilePicture,token })
})


export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateProfilePicture
};