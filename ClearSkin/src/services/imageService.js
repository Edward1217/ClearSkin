import axios from 'axios';

// Function to save image URL to backend
const uploadImageUrl = async (imageUrl) => {
    try {
        const token = localStorage.getItem('token'); // Get JWT token from localStorage
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Send the token in headers
                'Content-Type': 'application/json',
            },
        };

        const response = await axios.post('/api/image', { imageUrl }, config);
        return response.data; // Return the response from backend
    } catch (error) {
        console.error('Error uploading image URL:', error.response?.data || error.message);
        throw error;
    }
};

export default {
    uploadImageUrl,
};
