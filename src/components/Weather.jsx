import React, { useState, useRef, useEffect } from 'react';
import './Weather.css';
import {
    SearchIcon,
    ClearIcon,
    CloudIcon,
    RainIcon,
    SnowIcon,
    HumidityIcon,
    WindIcon
} from './WeatherIcons';

const Weather = () => {
    const cityInputRef = useRef();
    const [currentWeather, setCurrentWeather] = useState(null);

    const weatherIcons = {
        "01d": ClearIcon,
        "01n": ClearIcon,
        "02d": CloudIcon,
        "02n": CloudIcon,
        "03d": CloudIcon,
        "03n": CloudIcon,
        "04d": RainIcon,
        "04n": RainIcon,
        "09d": RainIcon,
        "09n": RainIcon,
        "10d": RainIcon,
        "10n": RainIcon,
        "13d": SnowIcon,
        "13n": SnowIcon
    };

    const fetchWeatherData = async (cityName) => {
        if (!cityName) {
            alert("Please enter a city name");
            return;
        }
        try {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const apiResponse = await fetch(apiUrl);
            const weatherInfo = await apiResponse.json();

            if (!apiResponse.ok) {
                alert(weatherInfo.message);
                return;
            }

            const WeatherIcon = weatherIcons[weatherInfo.weather[0].icon] || ClearIcon;
            setCurrentWeather({
                humidity: weatherInfo.main.humidity,
                windSpeed: weatherInfo.wind.speed,
                temperature: Math.floor(weatherInfo.main.temp),
                location: weatherInfo.name,
                icon: WeatherIcon
            });
        } catch (error) {
            setCurrentWeather(null);
            console.error("Error fetching weather data:", error);
        }
    };

    useEffect(() => {
        fetchWeatherData("New York");
    }, []);

    return (
        <div className='weather-container'>
            <div className='search-container'>
                <input ref={cityInputRef} type="text" placeholder='Enter city name' />
                <div className="search-icon" onClick={() => fetchWeatherData(cityInputRef.current.value)}>
                    <SearchIcon />
                </div>
            </div>

            {currentWeather && (
                <>
                    <div className="weather-icon">
                        {React.createElement(currentWeather.icon)}
                    </div>
                    <p className='temperature'>{currentWeather.temperature}°C</p>
                    <p className='location'>{currentWeather.location}</p>
                    <div className='weather-details'>
                        <div className='detail-item'>
                            <HumidityIcon />
                            <div>
                                <p>{currentWeather.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className='detail-item'>
                            <WindIcon />
                            <div>
                                <p>{currentWeather.windSpeed} m/s</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Weather;
