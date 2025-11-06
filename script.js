const apiKey = 'da1a9bd85d71c1043f6d51f509982adf';

async function getWeather() {
  const city = document.getElementById('city').value.trim();
  const weatherDiv = document.getElementById('weather');
  const forecastDiv = document.getElementById('forecast');
  const errorEl = document.getElementById('error');

  if (!city) {
    errorEl.textContent = 'Please enter a city name.';
    weatherDiv.classList.add('hidden');
    forecastDiv.classList.add('hidden');
    return;
  }

  try {
    errorEl.textContent = '';

    // Fetch current weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!weatherRes.ok) throw new Error('City not found');
    const weatherData = await weatherRes.json();

    // Update current weather UI
    document.getElementById('city-name').textContent = weatherData.name;
    document.getElementById('description').textContent = weatherData.weather[0].description;
    document.getElementById('temp').textContent = weatherData.main.temp;
    document.getElementById('humidity').textContent = weatherData.main.humidity;
    document.getElementById('wind').textContent = weatherData.wind.speed;

    weatherDiv.classList.remove('hidden');

    // Fetch 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();
    const forecastCards = document.getElementById('forecast-cards');
    forecastCards.innerHTML = '';

    const dailyData = {};

    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date] && item.dt_txt.includes('12:00:00')) {
        dailyData[date] = {
          temp: item.main.temp,
          desc: item.weather[0].description
        };
      }
    });

    Object.entries(dailyData).slice(0, 5).forEach(([date, data]) => {
      const div = document.createElement('div');
      div.classList.add('day');
      div.innerHTML = `
        <strong>${new Date(date).toDateString().slice(0, 10)}</strong>
        <p>${data.desc}</p>
        <p>${data.temp} °C</p>
      `;
      forecastCards.appendChild(div);
    });

    forecastDiv.classList.remove('hidden');

  } catch (err) {
    errorEl.textContent = err.message;
    weatherDiv.classList.add('hidden');
    forecastDiv.classList.add('hidden');
  }
}

// Dark mode toggle
document.getElementById('toggle-dark').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
