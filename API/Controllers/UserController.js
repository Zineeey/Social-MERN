const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone');


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET_KEY, {expiresIn: '3d'});
}

const loginUser = async (req, res) =>{
    const {email, password} = req.body;

    try{
        const user = await User.login(email, password);
        const first_name = user.first_name;
        const last_name = user.last_name;
        const id = user._id;
        const token = createToken(user._id);
        res.status(200).json({email, fullName: `${first_name} ${last_name}`, _id: id, token});

    }catch(error){
        res.status(400).json({error: error.message});
    }
}

const registerUser = async (req, res) =>{
    const {email, password, first_name, last_name, age, birthdate} = req.body;

    try{

        const birthdateUTC = moment.tz(birthdate, 'Asia/Shanghai').utc().toDate();
        const user = await User.registerUser(email, password, first_name, last_name, age, birthdateUTC);
        const token = createToken(user._id);
        const id = user._id;
        res.status(201).json({email, fullName: `${first_name} ${last_name}`, _id: id, token});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

const profileData = async(req, res) => {
    // console.log(req.user._id)
    const user = await User.findById(req.user._id).select('-password').populate('connections','-password, -posts')
    
    if(!user){
        return res.status(404).json({error: 'User not found'});
    }
    res.status(200).json(user);
}

const addConnection = async (req, res) => {
    try {
        const userToAdd = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToAdd) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add to current user's connections if not already present
        if (!currentUser.connections.includes(userToAdd._id)) {
            currentUser.connections.push(userToAdd._id);
        } else {
            return res.status(400).json({ error: 'Connection already exists' });
        }

        // Add current user to userToAdd's followers if not already present
        if (!userToAdd.followers.includes(currentUser._id)) {
            userToAdd.followers.push(currentUser._id);
        }

        // Save both users
        await currentUser.save();
        await userToAdd.save();

        res.status(200).json({ message: 'Connection added and user followed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const removeConnection = async (req, res) => {
    try {
        const userToRemove = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToRemove) {
            return res.status(404).json({ error: 'User to remove not found' });
        }
        
        // Remove from current user's connections if present
        if (currentUser.connections.includes(userToRemove._id)) {
            currentUser.connections = currentUser.connections.filter(id => id.toString() !== userToRemove._id.toString());
        } else {
            return res.status(400).json({ error: 'Connection does not exist' });
        }

        // Remove current user from userToRemove's followers if present
        if (userToRemove.followers.includes(currentUser._id)) {
            userToRemove.followers = userToRemove.followers.filter(id => id.toString() !== currentUser._id.toString());
        }

        // Save both users
        await currentUser.save();
        await userToRemove.save();

        res.status(200).json({ message: 'Connection removed and user unfollowed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




const getAllUser = async (req, res) =>{
    const user = req.user._id;
    try{
        const users = await User.find({ _id : { $ne: user } }).select('-password');
        res.status(200).json(users);
    }catch(error){
        res.status(400).json({error: error.message});
    }
}


const getUser = async (req, res) =>{
    const user = req.params.id;
    try{
        const users = await User.find(user).select('-password');
        if(!users){
            return res.status(404).json({error: 'User not found'});
        }else{
            res.status(200).json(users);
        }
        res.status(200).json(users);
    }catch(error){
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    registerUser,
    loginUser, 
    profileData,
    addConnection, 
    removeConnection, 
    getAllUser, 
    getUser
};