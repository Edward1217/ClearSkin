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
        try {
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                return;
            }
            setLoading(false);
            setError(null);
            navigate('/');
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };
    console.log(formData)
    return (
        <div className="px-3 py-3 mx-auto w-50">
            <h1 className="fs-3 fw-bold text-center my-5">Sign In</h1>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

                <input
                    type="email"
                    placeholder="email"
                    className="form-control"
                    id="email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="password"
                    className="form-control"
                    id="password"
                    onChange={handleChange}
                />

                <button
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
            </form>
            <div className="d-flex gap-2 mt-5">
                <p>Do you have an account?</p>
                <Link to={'/sign-up'}>
                    <span className="text-primary">Sign up</span>
                </Link>
            </div>
            {error && <p className="text-danger mt-5">{error}</p>}
        </div>
    );
}


