import { createContext, useReducer } from "react";

export const PostContext = createContext();

export const postReducer = (state, action) => {
    switch (action.type) {
        case 'GET_POSTS':
            return { posts: action.payload };
        case 'CREATE_POST':
            return {
                posts: [action.payload, ...state.posts],
            };
        case 'DELETE_POST':
            return {
                posts: state.posts.filter(post => post._id !== action.payload),
            };
        case 'UPDATE_POST':
            return {
                posts: state.posts.map(post => post._id === action.payload._id ? action.payload : post),
            };
        case 'DELETE_COMMENT':
            return {
                posts: state.posts.map(post => {
                    if (post._id === action.payload.postId) {
                        return {
                            ...post,
                            comments: post.comments.filter(comment => comment._id !== action.payload.commentId),
                        };
                    }
                    return post;
                }),
            };
        default:
            return state;
    }
};

export const PostProvider = ({ children }) => {
    const [state, dispatch] = useReducer(postReducer, { posts: [] }); 

    console.log('PostContext state: ', state);

    
    return (
        <PostContext.Provider value={{ ...state, dispatch }}>
            {children}
        </PostContext.Provider>
    );
};
