import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../Hooks/useAuthContext';
import './Explore.css'

const { getUsers, followUser, unfollowUser } = require('../../Service/ApiService');

const Explore = () => {
    const { user } = useAuthContext();
    const [users, setUsers] = useState([]);
    const [followedUsers, setFollowedUsers] = useState(new Set());

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                if (response.status === 200) {
                    setUsers(response.data);
                }
            } catch (error) {
                console.log("Error: ", error);
            }
        };

        if (user) {
            fetchUsers();
        }
    }, [user]);

    useEffect(() => {
        if (user && users.length > 0) {
            
            const followed = new Set(users.filter(u => u.followers.includes(user._id)).map(u => u._id));
            setFollowedUsers(followed);
        }
    }, [users, user]);

    const handleFollow = async (userID, action) => {
        try {
            if (action === 'Follow') {
                console.log('Followed ', userID);
                const response = await followUser(userID);
                if (response.status === 200) {
                    setFollowedUsers(prev => new Set(prev.add(userID))); 
                }
            } else {
                console.log('Unfollowed ', userID);
                const response = await unfollowUser(userID);
                if (response.status === 200) {
                    setFollowedUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(userID);
                        return newSet;
                    }); 
                }
            }
        
            const response = await getUsers();
            if (response.status === 200) {
                setUsers(response.data);
            }

        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <div className="explore-container">
            <h1>Explore</h1>
            <div className='users-card'>
                {users.map(u => (
                    <div key={u._id} className='card'>
                        <img
                            className="user-image h-24 w-24 rounded-full"
                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            alt="User profile"
                        />
                        <div className='card-content'>
                            <h3>{u.first_name} {u.last_name}</h3>
                            <p>{u.email}</p>
                            <p>Age: {u.age}</p>
                            <p>Following: {u.connections.length}</p>
                            <p>Followers: {u.followers.length}</p>

                            {
                                followedUsers.has(u._id) ? (
                                    <button className='unfollow-button' onClick={() => handleFollow(u._id, 'Unfollow')}>Unfollow</button>
                                ) : (
                                    <button className='follow-button' onClick={() => handleFollow(u._id, 'Follow')}>Follow</button>
                                )
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Explore;
