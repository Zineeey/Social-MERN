import Posts from '../Posts/Posts';
import CreatePost from '../Posts/CreatePost';
import './Feed.css';
import { usePostContext } from '../../Hooks/usePostContext';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useEffect } from 'react';
const { fetchPosts } = require('../../Service/ApiService');

const Feed = () =>{

    const {posts, dispatch} = usePostContext();
    const {user} = useAuthContext();

    useEffect(() => {
        const loadPosts = async () => {
            if (user) {
                const response = await fetchPosts();
                if (response && response.status === 200) {
                    dispatch({ type: 'GET_POSTS', payload: response.data });
                } else {
                    console.error('Failed to fetch posts');
                }
            }
        };
    
        loadPosts();
    }, [dispatch, user]);

    return (
        <div className="feed-container">
            <CreatePost />
            <div className="post-container">
            {posts && posts.length > 0 ? (
                posts.map((post) => (
                    <Posts key={post._id} post={post} />
                ))
            ) : (
                <p>No posts available</p>
            )}
            </div>
            
        </div>
    );
}

export default Feed;