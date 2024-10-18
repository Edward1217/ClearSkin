import React, { useEffect, useState } from "react";
import locationService from '../services/locationService';
import weatherService from '../services/weatherService';
import { useUser } from '../context/UserContext'; // 引入 UserContext 来获取用户信息
import img1 from '../images/skin2.jpg';
import CameraCapture from "../components/CameraCapture";
import ImageUploader from '../components/ImageUploader';
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
        <div className="container-fluid bg-white hero-header mb-5">
            <div className="container">
                <div className="row g-5 pt-5">
                    <div className="col-lg-6 align-self-center text-center text-lg-start mb-lg-5">
                        <h1 className="display-4 text-black mb-4 animated slideInRight fw-bold">
                            Intelligent Skin Analysis for Skin Diseases
                        </h1>
                        <h4 className="text-black mb-4 animated slideInRight">
                            Comprehensive Dermatology Diagnostics for Patients, Physicians, and Healthcare Providers
                        </h4>

                        {/* 如果用户信息存在，则显示用户名 */}
                        {user && user.name ? (
                            <p className="text-white">Welcome, {user.name}!</p>
                        ) : (
                            <p className="text-white">Fetching user info...</p>
                        )}
                    </div>

                    <div className="col-lg-6 align-self-center text-center">
                        <img
                            src={img1}
                            alt="Skin Condition Example"
                            className="rounded-9"
                            style={{ width: "100%", height: "auto", borderRadius: "15px" }}
                        />
                    </div>

                    <div className="container">
                        <div className="row g-4 mt-5 d-flex justify-content-center">
                            <div className="col-md-4 col-12">
                                <div className="card shadow-sm text-white" style={{
                                    background: "linear-gradient(135deg, #ff7b47, #ffb347)",
                                    borderRadius: "20px",
                                    height: "300px"
                                }}>
                                    <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                                        <FaLocationDot size={40} className="p-2" />
                                        {/* Display the map image */}
                                        {mapUrl ? (
                                            <img
                                                src={mapUrl}
                                                alt="Map"
                                                className="rounded-9 mb-2"
                                                style={{ maxWidth: "80%", height: "auto", borderRadius: "15px", margin: "0 auto" }}
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
                                    <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                                        <TiWeatherPartlySunny size={40} />
                                        <p className="card-text mt-2">
                                            {weather.condition !== null ? (
                                                <>
                                                    <p className="text-white">Condition: {weather.condition}</p>
                                                    <p className="text-white">UV Index: {weather.uv}</p>
                                                    {weather.icon && (
                                                        <img src={weather.icon} alt="Weather Icon" className="mt-2" />
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
                                    <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                                        <FaTemperatureHigh size={40} />
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
                    </div>

                    <div className="container-fluid bg-white hero-header mb-5">
                        <div className="container">
                            <div className="row g-5 mt-5">
                                <div className="col-md-6 col-sm-12" id="capture from camera">
                                    <div className="card-body text-center">
                                        <h1>Capture Photo with Webcam</h1>
                                        <CameraCapture onCapture={handleCapture} />
                                    </div>
                                    <div>
                                        {capturedPhoto && (
                                            <ImageUploader capturedImage={capturedPhoto} />
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6 col-sm-12" id="upload from local folder">
                                    <header className="text-center card-body">
                                        <h1>Image Upload</h1>
                                        <p className="lead mb-4">Upload an image to preview it below.</p>
                                    </header>

                                    <div className="row">
                                        <div className="col-lg-12 mx-auto">
                                            <ImageUploader />
                                        </div>
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
