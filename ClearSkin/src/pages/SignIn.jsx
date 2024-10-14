import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import { UserContext } from '../context/UserContext';

const SignIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    // Function to manually decode JWT token
    const decodeJwt = (token) => {
        try {
            const base64Url = token.split('.')[1]; // Get the payload part of the JWT
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload); // Parse the payload as JSON
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await userService.login({ email: formData.email, password: formData.password });

            if (data.token) {
                // Manually decode the JWT token
                const decodedToken = decodeJwt(data.token);

                if (decodedToken) {
                    // Store the full user info in localStorage
                    const userInfo = {
                        id: decodedToken.id, // Extracted from the decoded JWT token
                        name: data.name,     // From the backend login response
                        username: data.username,  // 从后端获取的邮箱
                        role: data.role,    // 从后端获取的角色
                    };

                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(userInfo));

                    // Update UserContext
                    setUser(userInfo);

                    navigate('/'); // Redirect to the home page
                } else {
                    setError('Failed to decode token.');
                }
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
