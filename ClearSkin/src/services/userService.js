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

        const { token, username, name, role } = response.data;

        // 将 token 存储到 localStorage 或其他地方，便于后续请求使用
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ username, name, role }));

        // 返回用户信息（不再只返回 token）
        return { token, username, name, role };
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};
export default {
    signUp,
    login,
};
