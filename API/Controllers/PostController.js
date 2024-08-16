const Post = require('../Models/PostModel');
const User = require('../Models/UserModel');
const mongoose = require('mongoose');

const createPost = async (req, res) => {
    const { title, content } = req.body;
    const user_id = req.user._id;

    try {
        if (!title || !content) {
            throw new Error("Title and Content are required");
        }

        const post = await Post.create({ title, content, user_id });

        const populatedPost = await Post.findById(post._id)
            .populate('user_id', ['first_name', 'last_name', 'email'])
            .populate('likes', ['first_name', 'last_name', 'email'])
            .populate('comments.user_id', ['first_name', 'last_name', 'email']);


        res.status(201).json(populatedPost);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user_id', ['first_name', 'last_name', 'email'])
            .populate('likes', ['first_name', 'last_name', 'email'])
            .populate('comments.user_id', ['first_name', 'last_name', 'email'])
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try{
        const posts = await Post.find({user_id: req.user._id})
            .populate('user_id', ['first_name', 'last_name', 'email'])
            .populate('likes', ['first_name', 'last_name', 'email'])
            .populate('comments.user_id', ['first_name', 'last_name', 'email'])
            .sort({ createdAt: -1 });

        res.status(200).json(posts);    
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID)
            .populate('user_id', ['first_name', 'last_name', 'email'])
            .populate('likes', ['first_name', 'last_name', 'email'])
            .populate('comments.user_id', ['first_name', 'last_name', 'email']);

        if (!post) {
            throw new Error("Post not found");
        }

        if (post.likes.includes(req.user._id)) {
            throw new Error("You already liked this post");
        } else {
            post.likes.push(req.user._id);
            await post.save();
            res.status(200).json(post);
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const commentPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);

        if (!post) {
            throw new Error("Post not found");
        }

        post.comments.push({ user_id: req.user._id, content: req.body.content });
        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate('user_id', ['first_name', 'last_name', 'email'])
            .populate('likes', ['first_name', 'last_name', 'email'])
            .populate('comments.user_id', ['first_name', 'last_name', 'email']);

        res.status(200).json(populatedPost);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deletePost = async (req, res) => {
    const { postID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postID)) {
        return res.status(404).json({ error: 'Invalid Post ID' });
    }

    try {
        const post = await Post.findByIdAndDelete(postID);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { postID, commentID } = req.params;

        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const commentExists = post.comments.some(comment => comment._id.toString() === commentID);

        if (!commentExists) {
            return res.status(400).json({ error: 'Comment not found' });
        }

        await Post.updateOne(
            { _id: postID },
            { $pull: { comments: { _id: commentID } } }
        );

        const updatedPost = await Post.findById(postID)
            .populate('user_id', ['first_name', 'last_name', 'email'])
            .populate('likes', ['first_name', 'last_name', 'email'])
            .populate('comments.user_id', ['first_name', 'last_name', 'email']);

        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeLike = async (req, res) => {
    try {
        const postID = req.params.postID;
        const userID = req.user._id;

        const post = await Post.findById(postID)
            .populate('user_id', ['first_name', 'last_name', 'email']);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!post.likes.includes(userID)) {
            return res.status(400).json({ error: 'You have not liked this post' });
        }

        await Post.updateOne(
            { _id: postID },
            { $pull: { likes: userID } }
        );

        const updatedPost = await Post.findById(postID)
            .populate('user_id', ['first_name', 'last_name', 'email']);

        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.postID)
            .populate('user_id', ['first_name', 'last_name', 'email'])
            .populate('likes', ['first_name', 'last_name', 'email'])
            .populate('comments.user_id', ['first_name', 'last_name', 'email']);

        if (!post) {
            throw new Error("Post not found");
        }

        if (title) {
            post.title = title;
        }
        if (content) {
            post.content = content;
        }

        await post.save();
        res.status(200).json(post);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createPost,
    getPosts,
    likePost,
    commentPost,
    deleteComment,
    removeLike,
    updatePost,
    deletePost,
    getUserPosts
};
