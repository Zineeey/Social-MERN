import { useEffect, useState } from 'react';
import './UserProfile.css';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { getUserPosts, getUserProfile } from '../../Service/ApiService';
import Posts from '../Posts/Posts';

const UserProfile = () => {
    const { user, profile, dispatch } = useAuthContext();
    const [formattedBirthdate, setFormattedBirthdate] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const response = await getUserProfile();
                    if (response.status === 200) {
                        dispatch({ type: 'GET_PROFILE', payload: response.data });
                    } else {
                        console.error('Failed to fetch profile');
                    }
                } catch (error) {
                    console.error('An error occurred while fetching the profile:', error);
                }
            }
        };
        fetchProfile();
    }, [dispatch, user]);

    useEffect(() => {
        if (profile && profile.birthdate) {
            const formatDate = (dateString) => {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            };
            setFormattedBirthdate(formatDate(profile.birthdate));
        }
    }, [profile]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (user) {
                try {
                    const response = await getUserPosts();
                    if (response.status === 200) {
                        setPosts(response.data); // Set posts to state
                    } else {
                        console.error('Failed to fetch posts');
                    }
                } catch (error) {
                    console.error('An error occurred while fetching posts:', error);
                }
            }
        };

        fetchUserPosts();
        const intervalId = setInterval(fetchUserPosts, 1000); 

        return () => clearInterval(intervalId); 
    }, [user]);

    return (
        <>
            {profile ? (
                <div className="user-profile-container">
                    <div className="user-profile-top">
                        <div className="profile-container">
                            <img
                                className="user-profile"
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                alt="User profile"
                            />
                        </div>
                        <div className="basic-details">
                            <h1 className="full-name">{profile.first_name} {profile.last_name}</h1>
                            <h2 className="email">{profile.email}</h2>
                            <div className = 'connections'>
                                <div className="item">
                                    <p>Following: {profile.connections.length}</p>
                                </div>
                                <div className="item">
                                    <p>Followers: {profile.followers.length}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    
                    <div className="user-profile-bottom">
                        <div className="profile-bottom-left">
                            <div className='item-container'>
                                <div className="item">
                                    <p>Age: {profile.age}</p>
                                </div>
                                <div className="item">
                                    <p>Birthday: {formattedBirthdate}</p>
                                </div>

                            </div>
                            
                        </div>

                        <div className="profile-bottom-right">
                            <div className="posts">
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <div key={post._id} className="post">
                                            <Posts post={post} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-posts">
                                        <p>No posts yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loading-container">
                    <div className="loading"></div>
                    <p className="loading-text">Fetching data, Please wait...</p>
                </div>
            )}
        </>
    );
};

export default UserProfile;
