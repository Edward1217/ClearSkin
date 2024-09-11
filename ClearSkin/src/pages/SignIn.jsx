import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginService from '../services/login'; // Assume you have a service to handle login requests
import { UserContext } from '../context/UserContext.jsx'; // Import UserContext

const SignIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserName } = useContext(UserContext); // Get setUserName from context

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await loginService.login({ email: formData.email, password: formData.password });

            if (data.token) {
                // Store user info in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('name', data.name);

                // Update global user context
                setUserName(data.name);

                navigate('/'); // Redirect to homepage
            } else {
                setError('Login failed');
            }
        } catch (err) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
            </form>
            {error && <p>{error}</p>}
            <Link to="/sign-up">Sign Up</Link>
        </div>
    );
};

export default SignIn;
