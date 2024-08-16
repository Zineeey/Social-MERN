import axios from 'axios';
const api = axios.create({baseURL: 'http://localhost:4000/api/'});

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('token'));
    return user?.token;
}

const fetchPosts = async () =>{
    try{
        const response = await api.get('/post/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
        return response;

    }catch(error){
        console.log("Error: ", error)
    }
}

const createPost = async (data) => {
    try{

        const response = await api.post('/post/create', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        return response;

    }catch(error){
        console.log("Error: ", error)
    }
}

const deletePost = async (id) => {
    try{
        const response = await api.delete('/post/' + id+'/delete', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        return response;
    }
    catch(error){
        console.log("Error: ", error)
    }
}



const likePost = async (id) => {
    try{
        const response = await api.post('/post/' + id +'/like',{}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        return response;
    }
    catch(error){
        console.log("Error: ", error)
    }
}

const unlikePost = async (id) => {
    try{
        const response = await api.post('/post/' + id + '/unlike',{}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
        
        return response;

    }catch(error){
        console.log("Error: ", error)
    }
}

const commentPost = async (id, data) => {
    try{
        const response = await api.post('/post/' + id + '/comment', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }}
        )
        return response;

    }catch(error){
        console.log("Error: ", error)
    }
}

const deleteComment = async (postId, commentId) => {
    try{
        const response = await api.post('/post/' + postId + '/' + commentId + '/deleteComment',{}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response
    }catch(error){
        console.log("Error: ", error)   
    }
}

const updatePost = async (id, data) => {
    try{
        const response = await api.post('/post/' + id + '/update', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response;
    }catch(error){
        console.log("Error: ", error)
    }
}

const getUserProfile = async () => {
    try{
        const response = await api.get('/user/profile', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response;
    }catch(error){
        console.log('Error', error)
    }
}

const getUserPosts = async () =>{
    try{
        const response = await api.get('/post/getUserPosts/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response;
    }catch(error){
        console.log("Error: ", error)
    }
}

const getUsers = async () => {
    try{
        const response = await api.get('user/explore', {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Beared ${getAuthToken()}`
            }
        })
        return response;
    }catch(error){
        console.log('Error', error)
    }
}

const followUser = async (id) => {
    try{
        const response = await api.post('user/' + id + "/addConnection", {}, {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
        return response;
    }catch(error){
        console.log('Error', error)
    }
}

const unfollowUser = async (id) => {
    try{
        const response = await api.post('user/' + id + "/removeConnection", {}, {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response;
    }catch(error){
        console.log('Error', error)
    }
}

export { 
    createPost,
    deletePost,
    likePost,
    unlikePost,
    fetchPosts,
    commentPost,
    deleteComment,
    updatePost,
    getUserProfile,
    getUserPosts,
    getUsers,
    followUser,
    unfollowUser
 };