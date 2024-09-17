import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [formData, setFormData] = useState({});
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
        setError(null); // Reset error state
        try {
            setLoading(true);
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.error) {
                setLoading(false);
                setError(data.error);
                return;
            }
            setLoading(false);
            navigate('/sign-in');
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };
    console.log(formData)
    return (
        <div className="px-3 py-3 mx-auto w-50">
            <h1 className="fs-3 fw-bold text-center my-5">Sign Up</h1>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <input
                    type="email"
                    placeholder="email"
                    className="form-control"
                    id="username"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    placeholder="name"
                    className="form-control"
                    id="name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    placeholder="password"
                    className="form-control"
                    id="password"
                    onChange={handleChange}
                    required
                />
                <select
                    className="form-control"
                    // Handle role selection
                    required
                >
                    <option value="">Select Role</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                </select>
                <button
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
            </form>
            {error && <p className="text-danger mt-5">{error}</p>}
            <div className="d-flex gap-2 mt-5">
                <p>Have an account?</p>
                <Link to={'/sign-in'}><span className="text-primary">Sign in</span></Link>
            </div>
        </div>
    );
}
