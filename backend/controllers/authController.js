const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await user.create({
            username,
            email,
            password: hashedPassword,
            role: "author",
        })

        res.status(201).json({
            _id:newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            name: newUser.name,
            bio: newUser.bio,
            profilePic: newUser.profilePic,
            socialLinks: newUser.socialLinks,
            token: generateToken(newUser._id, newUser.role)
        })
    } catch (err) {
        res.status(500).json({ message: "register failed",error: err.message });
    }
};

const loginUser = async(req, res)=>{
    const{email, password}= req.body;

    try{
        const extistingUser = await user.findOne({email});
       
        if(!extistingUser){
            return res.status(400).json({message: "Invalid email or password"})
        }
        const isMatch = await bcrypt.compare(password, extistingUser.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"})
        }
        res.json({
            _id: extistingUser._id,
            username: extistingUser.username,
            email: extistingUser.email,
            role: extistingUser.role,
            name: extistingUser.name,
            bio: extistingUser.bio,
            profilePic: extistingUser.profilePic,
            socialLinks: extistingUser.socialLinks,
            token: generateToken(extistingUser._id, extistingUser.role)
        })
    }catch(err){
        res.status(500).json({ message: "login failed",error: err.message  });
    }
}

const getMe = async(req, res)=>{
    try{
        const foundUser = await user.findById(req.user._id).select("-password");
        res.json(foundUser);
    }catch(err){
        res.status(500).json({ message:"getMe err", error: err.message  });
    }
}

module.exports= {registerUser, loginUser, getMe}