import { useState } from 'react';
import './Post.css';
import { usePostContext } from '../../Hooks/usePostContext';
const { createPost } =  require('../../Service/ApiService');

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const { dispatch } = usePostContext();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
    
        try {
            if (!title || !content) {
                setError("Title and Content are required");
                return;
            }
    
            const data = { title, content };
            const response = await createPost(data);
        
            if (response.status === 201) { 
                const createdPost = response.data;
                dispatch({ type: 'CREATE_POST', payload: createdPost });
                setTitle('');
                setContent('');
            } else {
                setError(response.data.error || 'Failed to create post');
            }
        } catch (error) {
            setError('An unexpected error occurred');
            console.error(error);
        }
    }
    

    return (
        <div className="create-post-container">
            <img
                className="profile-image"
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="User profile"
            />
            <form className="create-post-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    className="post-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="What's on your mind?"
                    className="post-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
    