// Home.jsx
import React, { useEffect, useState } from "react";
import locationService from '../services/locationService';
import weatherService from '../services/weatherService';
import { useUser } from '../context/UserContext'; // 引入 UserContext 来获取用户信息
import img1 from '../images/skin4.jpg';
import CameraCapture from "../components/CameraCapture.jsx";
import ImageUploader from '../components/ImageUploader';
import UploadImage from "../components/UploadImage.jsx";

export default function Home() {
    const [city, setCity] = useState(null);
    const [weather, setWeather] = useState({ condition: null, uv: null, icon: null, temp_c: null });
    const [error, setError] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);  // 保存拍摄的照片
    const { user } = useUser(); // 从 UserContext 中获取用户信息

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

    // 处理拍摄照片
    const handleCapture = (photoFile) => {
        setCapturedPhoto(photoFile);
    };

    return (
        <div className="container-fluid bg-white hero-header mb-5">
            <div className="container ">
                <div className="row g-5 pt-5">
                    <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">

                        <h1 className="display-4 text-black mb-4 animated slideInRight fw-bold">
                            Intelligent Skin Analysis for Skin Diseases
                        </h1>
                        <h4 className="text-black mb-4 animated slideInRight">
                            Comprehensive Dermatology Solutions: Analytics for Patients, Physicians, and Healthcare
                            Providers
                        </h4>

                        {/* 如果用户信息存在，则显示用户名 */}
                        {user && user.name ? (
                            <p className="text-white">Welcome, {user.name}!</p>
                        ) : (
                            <p className="text-white">Fetching user info...</p>
                        )}

                        {city ? (
                            <p className="text-white">Your current city: {city}</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <p className="text-white">Fetching your city...</p>
                        )}


                    </div>

                    <div className="col-lg-6 align-self-center text-center">
                        <img
                            src={img1}
                            alt="Skin Condition Example"
                            className="rounded-9"
                            style={{width: "100%", height: "auto", borderRadius: "15px"}} // Rounded corners
                        />
                    </div>

                    <div className="row g-4 mt-5">
                        <div className="col-md-4">
                            <div className="card shadow-sm text-white" style={{
                                background: "linear-gradient(135deg, #ff7b47, #ffb347)",
                                borderRadius: "20px",
                                height: "300px"
                            }}>
                                <div
                                    className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                                    <i className="bi bi-house-door-fill mb-3"
                                       style={{fontSize: "3rem"}}></i> {/* Example icon */}
                                    <h5 className="card-title">City</h5>
                                    <p className="card-text mt-2">
                                        {city ? (
                                            <p className="text-white">Your current city: {city}</p>
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
                            <div className="card shadow-sm text-white" style={{
                                background: "linear-gradient(135deg, #4a90e2, #7fbbf2)",
                                borderRadius: "20px",
                                height: "300px"
                            }}>
                                <div
                                    className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                                    <i className="bi bi-cloud-sun-fill mb-3"
                                       style={{fontSize: "3rem"}}></i> {/* Example icon */}
                                    <h5 className="card-title">Weather</h5>
                                    <p className="card-text mt-2">
                                        {weather.condition && weather.uv ? (
                                            <>
                                                <p className="text-white">Condition: {weather.condition}</p>
                                                <p className="text-white">UV Index: {weather.uv}</p>
                                                {weather.icon && (
                                                    <img src={weather.icon} alt="Weather Icon" className="mt-2"/>
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
                            <div className="card shadow-sm text-white" style={{
                                background: "linear-gradient(135deg, #a166e2, #d3a0f4)",
                                borderRadius: "20px",
                                height: "300px"
                            }}>
                                <div
                                    className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                                    <i className="bi bi-thermometer-half mb-3"
                                       style={{fontSize: "3rem"}}></i> {/* Example icon */}
                                    <h5 className="card-title">Current Temperature</h5>
                                    <p className="card-text mt-2">
                                        {weather.temp_c ? (
                                            <p className="text-white">Temperature: {weather.temp_c}°C</p>
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

                    <div className="row g-5 mt-5">
                        <div className="col-md-6">
                            <div>
                                <div className="card-body text-center">
                                    <h1>Capture Photo with Webcam</h1>
                                    <CameraCapture onCapture={handleCapture}/>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div>
                                <div className="card-body text-center">
                                    {/*<h5>Upload or take photos of your skin condition</h5>*/}
                                    {/*<ImageUploader capturedImage={capturedPhoto}/>*/}
                                    <UploadImage/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

