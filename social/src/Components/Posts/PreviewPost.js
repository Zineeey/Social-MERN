import React, { useState } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { usePostContext } from '../../Hooks/usePostContext';
import { useAuthContext } from '../../Hooks/useAuthContext';
const { deleteComment } = require('../../Service/ApiService');

const PreviewPost = ({ post }) => {
    const { user } = useAuthContext();
    const { dispatch } = usePostContext();
    const [visibleOptionsId, setVisibleOptionsId] = useState(null);

    const handleDeleteComment = async (commentId) => {
        console.log('Deleting comment:', commentId);

        setVisibleOptionsId(null);
        try {
            const response = await deleteComment(post._id, commentId);
            if (response.status === 200) {
                dispatch({ type: 'DELETE_COMMENT', payload: { postId: post._id, commentId } });
            } else {
                console.error('Failed to delete comment');
            }
        } catch (error) {
            console.error('An error occurred while deleting the comment:', error);
        }
    };

    const handleToggleOption = (commentId) => {
        setVisibleOptionsId(prevId => prevId === commentId ? null : commentId);
    };

    return (
        <div className="preview-post">
            <div className="post-header">
                <div className="post-header-left">
                    <img
                        className="profile-image"
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="User profile"
                    />
                    <h4>
                        {post.user_id.first_name} {post.user_id.last_name}
                    </h4>
                </div>
            </div>

            <p className="time">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>

            <div className="post-body">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
            </div>

            <div className="post-footer">
                <span>{post.likes.length} Likes</span>
                <span>{post.comments.length} Comments</span>
            </div>

            <div className="comment-section">
                {post.comments.map((comment) => (
                    <div key={comment._id} className="comment">
                        <img
                            className="profile-image"
                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            alt="User profile"
                        />
                        <div className="comment-header">
                            <div className="comment-top">
                                <div className="comment-left">
                                    <h4>
                                        {comment.user_id.first_name} {comment.user_id.last_name}
                                    </h4>
                                </div>
                                <div className="comment-right">
                                    {user && user.email === comment.user_id.email && (
                                        <span
                                            onClick={() => handleToggleOption(comment._id)}
                                            className='option-btn'
                                        >
                                            ...
                                        </span>
                                    )}
                                    <div
                                        className={`comment-options ${visibleOptionsId === comment._id ? 'show' : ''}`}
                                    >
                                        <button onClick={() => handleDeleteComment(comment._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p>{comment.content}</p>
                            <div className="time">
                                {formatDistanceToNow(new Date(comment.createdAt), {
                                    addSuffix: true,
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreviewPost;
