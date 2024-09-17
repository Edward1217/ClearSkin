import axios from 'axios';

const baseSignUpUrl = '/api/users';
const baseLoginUrl = '/api/login';

// Signup service
const signUp = async (userData) => {
    try {
        const response = await fetch(baseSignUpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to sign up');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Login service
const login = async (credentials) => {
    try {
        const response = await axios.post(baseLoginUrl, credentials, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

export default {
    signUp,
    login,
};
