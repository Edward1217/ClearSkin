import axios from 'axios';

// imageService.js
const uploadImageUrl = async (imageUrl) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found in localStorage');
        }

        // 正确地将 imageUrl 包装成对象
        const response = await axios.post('/api/image', { imageUrl }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response from server:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up the request:', error.message);
        }
        throw error;
    }
};


export default { uploadImageUrl };
