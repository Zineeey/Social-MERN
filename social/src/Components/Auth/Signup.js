import { useState } from "react";
import './Auth.css';
import { Link } from 'react-router-dom';
import { useSignupContext } from "../../Hooks/useSignup";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [birthdateUTC, setBirthdateUTC] = useState('');
    const { signup, error, loading } = useSignupContext();
    const [loadingDelay, setLoadingDelay] = useState(false);

    const calculateAge = (birthdate) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const handleBirthdateChange = (e) => {
        const birthdate = e.target.value;
        setBirthdateUTC(birthdate);
        setAge(calculateAge(birthdate));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newBirthdate = new Date(birthdateUTC).toISOString();
        setLoadingDelay(true);
        
        try {
            await signup(email, password, first_name, last_name, age, newBirthdate);

            setTimeout(() => {
                setLoadingDelay(false);
            }, 1000);
            
        } catch (error) {
            console.error('Error during signup:', error);
        }
    }

    if (loading || loadingDelay) {
        return (
            <div className="loading-container">
                <div className="loading"></div>
                <p className="loading-text">Creating your account...</p>
            </div>
            )   
    }

    return (
        <div className="container">
            <form className="signup" onSubmit={handleSubmit}>
                <h1>Signup</h1>
                {error && <p className="error">{error}</p>}
                <label>Email: </label>
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-field"
                    required
                />

                <label>Password: </label>
                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-field"
                    required
                />

                <div className="form-groups-container">
                    <div className="form-group">
                        <label>First Name: </label>
                        <input
                            type="text"
                            value={first_name}
                            placeholder="First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                            className="form-field"
                            required
                        />

                        <label>Birthdate: </label>
                        <input
                            type="date"
                            value={birthdateUTC}
                            onChange={handleBirthdateChange}
                            className="form-field"
                            required
                        />
                    </div>  

                    <div className="form-group"> 
                        <label>Last Name: </label>
                        <input
                            type="text"
                            value={last_name}
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                            className="form-field"
                            required
                        />

                        <label>Age: </label>
                        <input
                            disabled={true}
                            type="number"
                            value={age}
                            placeholder="Age"
                            onChange={(e) => setAge(e.target.value)}
                            className="form-field"
                            required
                            min="0"        
                            max="120"     
                            step="1"      
                        />
                    </div>
                </div>

                <div className="form-bottom">
                    <Link to="/login" className="link-url">Back to Login</Link>
                    <button className="submit">Register</button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
