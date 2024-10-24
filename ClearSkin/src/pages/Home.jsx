import React, { useEffect, useState } from "react";
import locationService from '../services/locationService';
import weatherService from '../services/weatherService';
import { useUser } from '../context/UserContext'; // 引入 UserContext 来获取用户信息
import img1 from '../images/skin2.jpg';
import { FaTemperatureHigh } from "react-icons/fa";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaLocationDot } from "react-icons/fa6";

export default function Home() {
    const [city, setCity] = useState(null);  // 用于存储城市信息
    const [mapUrl, setMapUrl] = useState(null); // 存储Google地图URL
    const [weather, setWeather] = useState({ condition: null, uv: null, icon: null, temp_c: null });
    const [error, setError] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);  // 保存拍摄的照片
    const { user } = useUser(); // 从 UserContext 中获取用户信息

    useEffect(() => {
        // 获取用户的地理位置
        const fetchMapAndWeather = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    try {
                        const lat = position.coords.latitude;  // 获取纬度
                        const lng = position.coords.longitude; // 获取经度

                        // 获取地图 URL
                        const locationResponse = await locationService.getMapUrl(lat, lng);
                        setMapUrl(locationResponse.mapUrl);

                        // 获取天气信息
                        const weatherResponse = await weatherService.getWeather(`${lat},${lng}`);
                        setWeather({
                            condition: weatherResponse.condition,
                            uv: weatherResponse.uv,
                            icon: weatherResponse.icon.startsWith('http') ? weatherResponse.icon : `https:${weatherResponse.icon}`,
                            temp_c: weatherResponse.temp_c
                        });
                    } catch (error) {
                        setError('Failed to fetch data');
                        console.error('Error fetching weather data:', error);
                    }
                }, (error) => {
                    setError('Failed to get your location');
                });
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };

        fetchMapAndWeather();
    }, []);

    // 处理拍摄照片
    const handleCapture = (photoFile) => {
        setCapturedPhoto(photoFile);
    };

    return (
        <div className="container-fluid bg-white hero-header mb-0" style={{ paddingTop: "0" }}>
            <div className="container">
                <div className="row g-5" style={{marginTop: "0"}}>
                    <div className="row">
                        <div className="col-lg-6 align-self-center text-center text-lg-start mt-0 pt-0"
                             style={{marginTop: "-20px"}}>
                            <h1 className="display-4 text-black mb-2 animated slideInRight fw-bold">
                                Intelligent Skin Analysis for Skin Diseases
                            </h1>
                            <h4 className="text-black mb-2 animated slideInRight">
                                Comprehensive Dermatology Diagnostics for Patients, Physicians, and Healthcare Providers
                            </h4>

                            {/* Display the username if available */}
                            {user && user.name ? (
                                <p className="text-black mt-0">Welcome, {user.name}!</p>
                            ) : (
                                <p className="text-black mt-0">Fetching user info...</p>
                            )}
                        </div>

                        <div className="col-lg-6 align-self-center text-center">
                            <img
                                src={img1}
                                alt="Skin Condition Example"
                                className="rounded-9"
                                style={{width: "100%", height: "auto", borderRadius: "15px"}}
                            />
                        </div>
                    </div>


                    <div className="container">
                        <div className="row g-4 mt-5 d-flex justify-content-center">

                            <div className="col-md-4 col-12">
                                <div className="card shadow-sm text-white" style={{
                                    background: "white",
                                    borderRadius: "20px",
                                    height: "300px",
                                    position: "relative",  // Make the card relative to allow the image to be positioned absolutely
                                    overflow: "hidden"     // Ensures the image doesn't spill out of the card's borders
                                }}>
                                    <div
                                        className="card-body text-center d-flex flex-column justify-content-center align-items-center"
                                        style={{
                                            position: "relative",  // Keep the content on top of the image
                                            zIndex: 2              // Ensures content appears above the image
                                        }}>
                                        <FaLocationDot size={40} className="p-2"/>
                                        {/* Display the map image */}
                                        {mapUrl ? (
                                            <img
                                                src={mapUrl}
                                                alt="Map"
                                                className="rounded-9 mb-2"
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",  // Ensure the image covers the whole card without distortion
                                                    zIndex: 1,           // Send the image behind the content
                                                    opacity: 0.6         // Optional: Add some transparency to the image for better readability of content
                                                }}
                                            />
                                        ) : error ? (
                                            <p className="text-danger">{error}</p>
                                        ) : (
                                            <p className="text-white">Fetching your map...</p>
                                        )}
                                        <p className="card-text mt-2">
                                            {mapUrl ? (
                                                <p className="text-white"></p>
                                            ) : error ? (
                                                <p className="text-danger">{error}</p>
                                            ) : (
                                                <p className="text-white">Fetching your map...</p>
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
                                        <TiWeatherPartlySunny size={40}/>
                                        <p className="card-text mt-2">
                                            {weather.condition !== null ? (
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
                                        <FaTemperatureHigh size={40}/>
                                        <p className="card-text mt-2">
                                            {weather.temp_c ? (
                                                <p className="text-white">Temperature: {(weather.temp_c * 9 / 5 + 32).toFixed(0)}°F</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
