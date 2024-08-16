const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User_DB',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User_DB'
    }],
    comments: [
        {
            user_id: {
                type: Schema.Types.ObjectId,
                ref: 'User_DB',
                required: true
            },
            content: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Post_DB', postSchema);
