import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginService from '../services/login';
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
        setError(null); // Reset error state

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
        <div className="px-3 py-3 mx-auto w-50">
            <h1 className="fs-3 fw-bold text-center my-5">Sign In</h1>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <input
                    type="email"
                    placeholder="Email"
                    className="form-control"
                    id="email"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    id="password"
                    onChange={handleChange}
                    required
                />
                <button
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
            </form>
            {error && <p className="text-danger mt-5">{error}</p>}
            <div className="d-flex gap-2 mt-5">
                <p>Don't have an account?</p>
                <Link to={'/sign-up'}><span className="text-primary">Sign Up</span></Link>
            </div>
        </div>
    );
};

export default SignIn;
