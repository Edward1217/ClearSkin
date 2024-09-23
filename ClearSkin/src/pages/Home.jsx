import React, { useEffect, useState } from "react";
import locationService from '../services/locationService';  // 服务获取位置
import weatherService from '../services/weatherService';   // 服务获取天气
import img1 from './images/skin2.jpg';

export default function Home() {
    const [city, setCity] = useState(null);
    const [weather, setWeather] = useState({ condition: null, uv: null, icon: null, temp_c: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            try {
                // 获取城市数据
                const locationResponse = await locationService.getLocation();
                const cityName = locationResponse.city;
                setCity(cityName);

                // 获取天气数据
                const weatherResponse = await weatherService.getWeather(cityName);
                console.log('Weather Response:', weatherResponse); // 调试输出天气数据

                // 设置天气状态，确保 icon 是完整的 URL
                setWeather({
                    condition: weatherResponse.condition,
                    uv: weatherResponse.uv,
                    icon: `http:${weatherResponse.icon}`,  // 完整的图标URL
                    temp_c: weatherResponse.temp_c // 获取摄氏温度
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            }
        };

        fetchLocationAndWeather();
    }, []);

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
                    </div>

                    <div className="col-lg-6 align-self-center text-center">
                        <img src={img1} alt="123" style={{ width: "100%", height: "auto" }} />
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
                </div>
            </div>
        </div>
    );
}
