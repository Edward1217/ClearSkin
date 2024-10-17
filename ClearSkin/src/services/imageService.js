import axios from 'axios';

// 上传图片 URL 并进行分析
const uploadImageUrl = async (imageUrl) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found in localStorage');
        }

        // 上传图片 URL 到后端
        const response = await axios.post('/api/image', { imageUrl }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        handleError(error);
    }
};


// 上传图片到 /analyze 进行分析
const analyzeImage = async (formData) => {  // 这里接收 FormData
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post('/api/image/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        handleError(error);
    }
};
// 处理错误信息
const handleError = (error) => {
    if (error.response) {
        console.error('Error response from server:', error.response.data);
    } else if (error.request) {
        console.error('No response received:', error.request);
    } else {
        console.error('Error setting up the request:', error.message);
    }
    throw error;
};

export default { uploadImageUrl, analyzeImage };
