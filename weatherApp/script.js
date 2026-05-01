
// GO TO https://openweathermap.org/api abd sign up to get your API key and replace this
const apiKey = "f37d5bb25dd2a510c04d31a694d8d329";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (city === "") {
        showError("Please enter a city name");
        return;
    }
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    }
}

// WIND DIRECTIONS =)
function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
}

// DISPLAY WEATHER
function displayWeather(data) {
    const cityName = data.name;
    const tempCelsius = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const windDeg = data.wind.deg;
    const description = data.weather[0].description;

    const pressure = data.main.pressure;
    const visibility = data.visibility / 1000;
    const { lat, lon } = data.coord;

    document.getElementById("pressure").innerText = `Pressure: ${pressure} hPa`;
    document.getElementById("visibility").innerText = `Visibility: ${visibility} km`;
    getUVIndex(lat, lon);
    // ICON LOGIC
    const iconElement = document.getElementById("weatherIcon");
    const iconCode = data.weather[0].icon;

    const iconMap = {
        "01d": "sunny.png",
        "01n": "clear-night.png",
        "02d": "partly-cloudy.png",
        "03d": "day-clouds.png",
        "03n": "night-clouds.png",
        "04d": "day-broken-clouds.png",
        "04n": "night-broken-clouds.png",
        "09d": "day-rain.png",
        "10d": "night-rain.png",
        "11d": "thunderstorm.png",
        "13d": "snow.png",
        "50d": "mist.png"
    };

    const iconFile = iconMap[iconCode] || "default.png";
    iconElement.src = `assets/${iconFile}`;
    iconElement.style.display = "block";

    // UPDATING UI
    document.getElementById("cityName").innerText = cityName;
    document.getElementById("temperature").innerText = `Temp: ${tempCelsius.toFixed(1)}°C`;
    document.getElementById("feelsLike").innerText = `Feels like: ${feelsLike.toFixed(1)}°C`;
    document.getElementById("humidity").innerText = `Humidity: ${humidity}%`;
    document.getElementById("wind").innerText = `Wind: ${windSpeed} m/s ${getWindDirection(windDeg)}`;
    document.getElementById("description").innerText = `Condition: ${description}`;
    document.getElementById("error").innerText = "";

    changeBackground(tempCelsius);
}

// UV INDEX
async function getUVIndex(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const data = await response.json();
        const uvValue = data.list[0].main.aqi;
        document.getElementById("uvIndex").innerText = `UV Index: ${uvValue}`;
    } catch (error) {
        document.getElementById("uvIndex").innerText = `UV Index: N/A`;
    }
}

// INCASE THERES AN ERROR
function showError(message) {
    document.getElementById("error").innerText = message;
    document.getElementById("weatherIcon").style.display = "none";
    document.getElementById("cityName").innerText = "";
    document.getElementById("temperature").innerText = "";
    document.getElementById("feelsLike").innerText = "";
    document.getElementById("humidity").innerText = "";
    document.getElementById("wind").innerText = "";
    document.getElementById("description").innerText = "";
    document.getElementById("pressure").innerText = "";
    document.getElementById("visibility").innerText = "";
    document.getElementById("uvIndex").innerText = "";
}

// CHANGING BACKGROUND COLOR BASE THE TEMPERATURE
function changeBackground(temp) {
    const body = document.body;
    let newGradient = "";

    if (temp <= 10) {
        newGradient = "linear-gradient(135deg, #0ea5e9, #1e3a8a)";
    } else if (temp <= 20) {
        newGradient = "linear-gradient(135deg, #22c55e, #065f46)";
    } else if (temp <= 30) {
        newGradient = "linear-gradient(135deg, #f59e0b, #b45309)";
    } else {
        newGradient = "linear-gradient(135deg, #ef4444, #7f1d1d)";
    }

    document.body.style.setProperty("--next-bg", newGradient);
    document.styleSheets[0].addRule("body::after", `background: ${newGradient}`);
    body.classList.add("fade");

    setTimeout(() => {
        document.styleSheets[0].addRule("body::before", `background: ${newGradient}`);
        body.classList.remove("fade");
    }, 1500);
}
