import axios from 'axios';

// Function to get weather data based on city or location query
const getWeather = async (query) => {
    try {
        const response = await axios.get(`/api/weather`, {
            params: { query }, // 将城市名称或查询参数传递给后端
        });
        return response.data; // 返回天气数据
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

export default { getWeather };
