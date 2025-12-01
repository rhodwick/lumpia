const apiKey = "9a97c9747bd45641892948ad883abb11";
const city = "Manila"; // change city if you want

const weatherBox = document.getElementById("weather");

async function loadWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    // Extract needed data
    const temp = Math.round(data.main.temp);
    const icon = data.weather[0].icon;
    const condition = data.weather[0].main; // Sunny / Rain / Clouds / etc.

    weatherBox.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${icon}.png" width="32">
      <span>${temp}°C</span>
      <span style="margin-left: 5px; font-weight: bold;">${condition}</span>
    `;
  } catch (error) {
    weatherBox.innerHTML = "Weather unavailable";
  }
}

loadWeather();
