import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Explore from './Components/Explore/Explore';
import Feed from './Components/Feed/Feed';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';

import UserProfile from './Components/UserProfile/UserProfile';
import { useAuthContext } from './Hooks/useAuthContext';
import { useEffect, useState } from 'react';

function App() {
  const { user, dispatch } = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('token'));
    if (storedUser) {
        dispatch({ type: 'LOGIN', payload: storedUser });
    }
    setTimeout(()=>{
      setLoading(false); 
    }, 1000)
    
  }, [dispatch]);


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p className="loading-text">Fetching data, Please wait...</p>
      </div>
    )
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/explore" element={user ? <Explore /> : <Navigate to="/login" />} />
          <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
