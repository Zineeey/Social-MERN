import React, { useState, useEffect } from 'react';
import Liked from '../../Assets/liked.svg';
import Unlike from '../../Assets/unlike.svg';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { usePostContext } from '../../Hooks/usePostContext';
import PreviewPost from './PreviewPost';
import Modal from '../Modal/Modal';
import UpdatePost from './UpdatePost';

const { deletePost, likePost, unlikePost, commentPost } = require('../../Service/ApiService');

const Posts = ({ post }) => {
    const { user } = useAuthContext();
    const { dispatch } = usePostContext();
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isProcessingLike, setIsProcessingLike] = useState(false);
    const [localLikes, setLocalLikes] = useState(post.likes.length);
    const [isOwner, setIsOwner] = useState(false);
    const [previewPost, setPreviewPost] = useState(false);
    const [content, setContent] = useState('');
    const [updatePost, setUpdatePost] = useState(false);

    useEffect(() => {
        if (user) {
            // this is checker if user has liked the post or not
            const userHasLiked = post.likes.some((like) => like._id === user._id);
            setIsLiked(userHasLiked);

            // This is for owner checking
            setIsOwner(post.user_id._id === user._id);
        }
    }, [post, user]);

    const handleComment = async (e) => {
        e.preventDefault();
        const data = { content };
        const response = await commentPost(post._id, data);
        if (response.status === 200) {
            dispatch({ type: 'UPDATE_POST', payload: response.data });
        }
        setContent('');
    };

    const handleToggleOptions = () => {
        setIsOptionsVisible(prev => !prev);
    };

    const handleDeletePost = async () => {
        setIsOptionsVisible(false);
        const response = await deletePost(post._id);
        if (response.status === 200) {
            dispatch({ type: 'DELETE_POST', payload: post._id });
        }
    };

    const handleLike = async () => {
        if (isProcessingLike) return;

        setIsProcessingLike(true);

        try {
            const response = isLiked
                ? await unlikePost(post._id)
                : await likePost(post._id);

            if (response.status === 200) {
                const updatedPost = response.data;
                dispatch({ type: 'UPDATE_POST', payload: updatedPost });

                setLocalLikes(prev => (isLiked ? prev - 1 : prev + 1));
                setIsLiked(prev => !prev);
            } else {
                console.error('Failed to update like status');
            }
        } catch (error) {
            console.error('An unexpected error occurred while handling like:', error);
        } finally {
            setIsProcessingLike(false);
        }
    };

    const handlePreview = () => {
        setPreviewPost(true);
    };

    const closePreview = () => {
        setPreviewPost(false);
    };

    const handleUpdatePost = () => {
        setIsOptionsVisible(false);
        setUpdatePost(true);
    };

    const closeUpdate = () => {
        setUpdatePost(false);
    };

    return (
        <div className="post-item">
            <div className="post-header">
                <div className='post-header-left'>
                    <img
                        className="profile-image"
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="User profile"
                    />
                    <h4>
                        {post.user_id.first_name} {post.user_id.last_name}
                    </h4>
                </div>
                {isOwner && (
                    <div className='post-header-right'>
                        <span onClick={handleToggleOptions}>...</span>
                        {isOptionsVisible && (
                            <div className="post-options">
                                <button onClick={handleUpdatePost}>Update</button>
                                <button onClick={handleDeletePost}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="time">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>

            <div className="post-body">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
            </div>

            <div className="post-footer">
                {localLikes}
                <button onClick={handleLike} disabled={isProcessingLike}>
                    <img src={isLiked ? Liked : Unlike} className="like-icon" alt="Like" />
                </button>
                <button onClick={handlePreview}>{post.comments.length} Comments</button>
            </div>

            <div className="comment-section">
                <div className="comment">
                    <img
                        className="profile-image"
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="User profile"
                    />
                    <form className="add-comment" onSubmit={handleComment}>
                        <input
                            type="text"
                            placeholder="Comment ..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </form>
                </div>
            </div>

            <Modal isVisible={previewPost} onClose={closePreview}>
                <PreviewPost post={post} />
            </Modal>

            <Modal isVisible={updatePost} onClose={closeUpdate}>
                <UpdatePost post={post} onClose={closeUpdate} />
            </Modal>
        </div>
    );
};

export default Posts;
