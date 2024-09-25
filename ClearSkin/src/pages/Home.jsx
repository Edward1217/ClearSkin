import React, { useEffect, useState } from "react";
import locationService from '../services/locationService';
import weatherService from '../services/weatherService';
import img1 from './images/skin2.jpg';
import CameraCapture from "./CameraCapture";
import ImageUploader from '../components/ImageUploader'; // Import your ImageUploader component

export default function Home() {
    const [city, setCity] = useState(null);
    const [weather, setWeather] = useState({ condition: null, uv: null, icon: null, temp_c: null });
    const [error, setError] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);  // State for captured photo

    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            try {
                const locationResponse = await locationService.getLocation();
                const cityName = locationResponse.city;
                setCity(cityName);

                const weatherResponse = await weatherService.getWeather(cityName);
                setWeather({
                    condition: weatherResponse.condition,
                    uv: weatherResponse.uv,
                    icon: `http:${weatherResponse.icon}`,
                    temp_c: weatherResponse.temp_c
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            }
        };

        fetchLocationAndWeather();
    }, []);

    // Handle captured photo from CameraCapture
    const handleCapture = (photo) => {
        setCapturedPhoto(photo);  // Store captured photo in state
    };

    return (
        <div className="container-fluid bg-primary hero-header mb-5">
            <div className="container pt-5">
                <div className="row g-5 pt-5">
                    <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                        <div className="btn btn-sm border rounded-pill text-white px-3 mb-3 animated slideInRight">
                            AI.Tech
                        </div>
                        <h1 className="display-4 text-white mb-4 animated slideInRight">
                            Artificial Intelligence for Your Business
                        </h1>
                        <p className="text-white mb-4 animated slideInRight">
                            Location-based AI services for your business.
                        </p>

                        {city ? (
                            <p className="text-white">Your current city: {city}</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <p className="text-white">Fetching your city...</p>
                        )}

                        <div>
                            <h5>Upload or take photos of your skin condition</h5>
                            <ImageUploader capturedImage={capturedPhoto} />  {/* Pass captured photo to ImageUploader */}
                        </div>
                    </div>

                    <div className="col-lg-6 align-self-center text-center">
                        <img src={img1} alt="Skin Condition Example" style={{ width: "100%", height: "auto" }} />
                    </div>

                    <div className="row g-4 mt-5">
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body text-center">
                                    <h5 className="card-title">City</h5>
                                    <p className="card-text">
                                        {city ? (
                                            <p className="text-black">Your current city: {city}</p>
                                        ) : error ? (
                                            <p className="text-danger">{error}</p>
                                        ) : (
                                            <p className="text-white">Fetching your city...</p>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Weather</h5>
                                    <p className="card-text">
                                        {weather.condition && weather.uv ? (
                                            <>
                                                <p className="text-black">Condition: {weather.condition}</p>
                                                <p className="text-black">UV Index: {weather.uv}</p>
                                                {weather.icon && (
                                                    <img src={weather.icon} alt="Weather Icon" />
                                                )}
                                            </>
                                        ) : error ? (
                                            <p className="text-danger">Failed to fetch weather data</p>
                                        ) : (
                                            <p className="text-white">Fetching weather data...</p>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Current Temperature</h5>
                                    <p className="card-text">
                                        {weather.temp_c ? (
                                            <p className="text-black">Temperature: {weather.temp_c}°C</p>
                                        ) : error ? (
                                            <p className="text-danger">Failed to fetch temperature data</p>
                                        ) : (
                                            <p className="text-white">Fetching temperature data...</p>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1>Capture Photo with Webcam</h1>
                        <CameraCapture onCapture={handleCapture} /> {/* Pass handleCapture to CameraCapture */}
                    </div>
                </div>
            </div>
        </div>
    );
}
