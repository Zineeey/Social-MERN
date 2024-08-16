const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    first_name: {
        type : String,
        required: true
    },
    last_name: {
        type : String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    birthdate:{
        type: Date,
        required: true
    },
    connections:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User_DB'
        }
    ],
    followers:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User_DB'
        }
    ]


}, {timestamps: true});

userSchema.statics.registerUser = async function(email, password, first_name, last_name, age, birthdate){
    if(!email || !password || !first_name || !last_name || !age || !birthdate){
        throw Error('All fields are required');
    }
    if(!validator.isEmail(email)){
        throw Error('Email is invalid');
    }
    if(password.length < 6){
        throw Error('Password must be at least 6 characters');
    }

    const exists = await this.findOne({ email });

    if(exists){
        throw Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hashedPassword, first_name, last_name, age, birthdate });
    return user;
}

userSchema.statics.login = async function(email, password){
    if(!email || !password){
        throw Error('All fields are required');
    }

    const user = await this.findOne({ email });
    // console.log(user);
    if(!user){
        throw Error('User does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw Error('Invalid Password');
    }

    return user;
}

module.exports = mongoose.model('User_DB', userSchema);


