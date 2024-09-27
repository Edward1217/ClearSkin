// Home.jsx
import React, { useEffect, useState } from "react";
import locationService from '../services/locationService';
import weatherService from '../services/weatherService';
import { useUser } from '../context/UserContext';
import img1 from './images/skin2.jpg';
import CameraCapture from "./CameraCapture";
import ImageUploader from '../components/ImageUploader';

export default function Home() {
    const [city, setCity] = useState(null);
    const [weather, setWeather] = useState({ condition: null, uv: null, icon: null, temp_c: null });
    const [error, setError] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const { user } = useUser();

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

    // 处理拍摄的照片
    const handleCapture = (photoFile) => {
        setCapturedPhoto(photoFile);
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
                        <img src={img1} alt="Skin Condition Example" style={{ width: "100%", height: "auto" }} />
                    </div>
                </div>

                <div className="row g-4 mt-5">
                    {/* 您的其他卡片内容 */}
                </div>

                <div>
                    <h1>Capture Photo with Webcam</h1>
                    <CameraCapture onCapture={handleCapture} />
                </div>

                {/* 当 capturedPhoto 存在时才显示 ImageUploader */}
                {capturedPhoto && (
                    <div>
                        <h5>Upload the photo you have taken</h5>
                        <ImageUploader capturedImage={capturedPhoto} />
                    </div>
                )}
            </div>
        </div>
    );
}
