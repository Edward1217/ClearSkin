import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginService from '../services/login';

export default function SignIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await loginService.login(formData);

            if (!data.token) {
                setLoading(false);
                setError('Login failed');
                return;
            }

            // Save token using secure cookies (Preferably via httpOnly)
            document.cookie = `token=${data.token}; Secure; HttpOnly`;

            setLoading(false);
            navigate('/'); // Navigate on success
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.error || 'Login failed');
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
                <button disabled={loading} className="btn btn-primary">
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
            </form>
            {error && <p className="text-danger mt-5">{error}</p>}
            <div className="d-flex gap-2 mt-5">
                <p>No account?</p>
                <Link to={'/sign-up'}><span className="text-primary">Sign up</span></Link>
            </div>
        </div>
    );
}
