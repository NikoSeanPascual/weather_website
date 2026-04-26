const apiKey = "f37d5bb25dd2a510c04d31a694d8d329"; // replace this

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
function displayWeather(data) {
  const cityName = data.name;
  const tempCelsius = data.main.temp;
  const description = data.weather[0].description;

  document.getElementById("cityName").innerText = cityName;
  document.getElementById("temperature").innerText = `Temperature: ${tempCelsius.toFixed(2)} °C`;
  document.getElementById("description").innerText = `Weather: ${description}`;
  document.getElementById("error").innerText = "";

  changeBackground(tempCelsius);
}
function showError(message) {
  document.getElementById("error").innerText = message;
  document.getElementById("cityName").innerText = "";
  document.getElementById("temperature").innerText = "";
  document.getElementById("description").innerText = "";
}
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
