import axios from 'axios';

const baseUrl = '/api/cases'; // 设置基础URL

// 创建病例
export const createCase = async (caseData, token) => {
    try {
        const response = await axios.post(baseUrl, caseData, {
            headers: {
                Authorization: `Bearer ${token}`,  // 通过 JWT token 认证
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating case:', error);
        throw error.response ? error.response.data : new Error('Server error');
    }
};

// 获取医生的病例列表
export const getDoctorCases = async (token) => {
    try {
        const response = await axios.get(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`,  // 通过 JWT token 认证
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cases:', error);
        throw error.response ? error.response.data : new Error('Server error');
    }
};

// 保存病例
export const saveCase = async (caseData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/save`, caseData, {
            headers: {
                Authorization: `Bearer ${token}`,  // 通过 JWT token 认证
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving case:', error);
        throw error.response ? error.response.data : new Error('Server error');
    }
};

export default {
    createCase,
    getDoctorCases,
    saveCase,
};
