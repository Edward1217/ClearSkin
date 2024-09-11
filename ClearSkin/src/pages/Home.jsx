import React, { useEffect, useState } from "react";
import axios from 'axios';

export default function Home() {
    const [city, setCity] = useState(null);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState(null);  // State to hold the user's name

    useEffect(() => {
        // Check if the user is logged in by looking for the user's name in localStorage
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }

        // Fetch user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await axios.get('/api/location', {
                            params: { latitude, longitude }
                        });
                        setCity(response.data.city);
                    } catch (error) {
                        console.error("Error fetching city name:", error);
                        setError("Failed to fetch city name");
                    }
                },
                (err) => {
                    setError("Failed to retrieve location");
                    console.error(err);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser");
        }
    }, []);

    return (
        <div className="container-fluid bg-primary hero-header mb-5">
            <div className="container pt-5">
                <div className="row g-5 pt-5">
                    <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                        <div className="btn btn-sm border rounded-pill text-white px-3 mb-3 animated slideInRight">AI.Tech</div>
                        <h1 className="display-4 text-white mb-4 animated slideInRight">Artificial Intelligence for Your Business</h1>
                        <p className="text-white mb-4 animated slideInRight">Location-based AI services for your business.</p>

                        {/* Display the city name if available, otherwise show errors */}
                        {city ? (
                            <p className="text-white">Your current city: {city}</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <p className="text-white">Fetching your city...</p>
                        )}

                        {/* Conditionally render the user's name or SignIn button */}
                        {userName ? (
                            <p className="text-white">Welcome, {userName}!</p>
                        ) : (
                            <a href="/sign-in" className="btn btn-primary">Sign In</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
