import axios from 'axios';

// Function to get geolocation data from the backend
const getLocation = async () => {
    try {
        const response = await axios.get(`/api/location`);
        return response.data;
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error;
    }
};


export default { getLocation };
