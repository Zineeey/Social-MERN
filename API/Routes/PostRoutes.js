const express = require('express');
const {createPost, getPosts, likePost, commentPost, deleteComment, removeLike, updatePost, deletePost, getUserPosts} = require('../Controllers/PostController');
const requireAuth = require('../Middleware/Auth');
const router = express.Router();

// Middleware

router.use(requireAuth);
router.post('/create', createPost);
router.post('/:postID/like', likePost);
router.post('/:postID/comment', commentPost);
router.post('/:postID/:commentID/deleteComment', deleteComment);
router.post('/:postID/unlike', removeLike);
router.post('/:postID/update', updatePost);
router.delete('/:postID/delete', deletePost);

router.get('/', getPosts);
router.get('/getUserPosts/', getUserPosts);


module.exports = router;



