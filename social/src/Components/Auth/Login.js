import { useState } from "react";
import './Auth.css';
import { Link } from 'react-router-dom';
import { useLogin } from "../../Hooks/useLogin";
// const { login } = require('../../Services/Api');


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, error} = useLogin();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await login(email, password);
        }catch(error){
            console.error('Error during signup:', error);
            alert('Error during login');    
        }
    }



    return (
        <div className="container">
            <form className="signup" onSubmit={handleSubmit}>
                <h1>Login</h1>
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
                

                <div className="form-bottom">
                    <Link to="/signup" className="link-url">Create an Account</Link>
                    <button className="submit">Login</button>
                </div>
                


            </form>
        </div>
    );
}

export default Login;
