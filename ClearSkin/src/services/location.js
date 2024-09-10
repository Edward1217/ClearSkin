import axios from 'axios';

// Function to get geolocation data from the backend
const getLocation = async (ip) => {
    try {
        // Send GET request to backend API to fetch geolocation data
        const response = await axios.get(`/api/location`, {
            params: { ip },
        });
        return response.data;  // Return the geolocation data
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error;  // Throw the error so it can be handled in the calling component
    }
};

export default { getLocation };
