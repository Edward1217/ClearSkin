import axios from 'axios';

// Upload image URL and model diagnosis to the backend
const uploadImageUrl = async ({ imageUrl, modelDiagnosis }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found in localStorage');
        }

        // Send the imageUrl and modelDiagnosis as a JSON payload
        const response = await axios.post('/api/image', { imageUrl, modelDiagnosis }, {
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
// 上传图片到 /analyze_cnn 进行第二次模型分析
const analyzeImageCnn = async (formData) => {  // 这里接收 FormData
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post('/api/image/analyze_cnn', formData, {
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
// 获取用户的图片列表
export const fetchUserImages = async (userId) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found in localStorage');
        }

        const response = await axios.get(`/api/image/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// 删除指定的图片
export const deleteImage = async (imageId) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found in localStorage');
        }

        const response = await axios.delete(`/api/image/${imageId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export default { uploadImageUrl, analyzeImage,analyzeImageCnn,fetchUserImages, deleteImage};
