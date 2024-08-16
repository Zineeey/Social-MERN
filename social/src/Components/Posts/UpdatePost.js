import React, { useState } from "react";

import { updatePost } from "../../Service/ApiService";
import { usePostContext } from "../../Hooks/usePostContext";

const UpdatePost = ({ post , onClose }) => { 
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const { dispatch } = usePostContext();

    const handleUpdate = async (e) => {
        e.preventDefault();

        const data = { title, content };
        
        const response = await updatePost(post._id, data);
        if (response.status === 200) {
            console.log("Post updated successfully");
            dispatch({ type: "UPDATE_POST", payload: response.data });
            onClose();
        } else {
            console.log("Failed to update post");
        }

    };

    return (
        <>
            <form className="create-post-form" onSubmit={handleUpdate}>
                <div className="form-group">
                    <label className="update-label">Update Post</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="title" 
                        placeholder="Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea 
                        className="form-control" 
                        id="content" 
                        rows="3" 
                        placeholder="Content" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                    ></textarea>
                </div>
                <button type="submit" className="submit-button">Update</button>
            </form>   
        </>
    );
};

export default UpdatePost;
