import axios from 'axios';

// Function to get the Google Maps static map URL based on lat and lng
const getMapUrl = async (lat, lng) => {
    try {
        const response = await axios.get(`/api/location`, {
            params: { lat, lng },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching map URL:', error);
        throw error;
    }
};

export default { getMapUrl };
