import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// This function controls the 'register' element of the web page
function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const [hasRegistered, setHasRegistered] = useState(false);

    // Submits the user info to the api which adds it to the database (if it is correct and passes through the middleware functions)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://to-do-list-with-sign-up-backend.onrender.com/register', { username, password, isAdmin });
            alert('User registered successfully');
            setHasRegistered(true);
            console.log(response);
        } catch (error) {
            console.error(error);
            alert(error.response.data);
        }
    };

    return (
        <div className = "App">
            <h2>Register</h2>
            <p>Tip: If you want add, edit and manage your tasks then ensure you register with your Gmail account. Your username should end in '@gmail.com' if this is the case.</p>
            <p>Non-Gmail user's functionality is limited to just viewing the default sample tasks.</p>

            {(hasRegistered === true) ? (
                <>
                    <p>You have registered successfuly!</p>
                    <Link to="/login">
                        <button className="go-back">Go to Login</button>
                    </Link>
                </>
            ) : 
            <>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <button className="info" type="submit">Register</button>
                </form>
            </>}
        </div>
    );
}

export default Register;
