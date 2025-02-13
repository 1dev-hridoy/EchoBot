const axios = require('axios');
const config = require('../config/config.json');

module.exports = {
  name: "weather",
  description: "Get the current weather for a specified city.",
  author: "Hridoy",
  guide: {
    en: "Send /weather {city name} to get the current weather. Country name is optional.",
    bn: "/weather {শহরের নাম} পাঠিয়ে বর্তমান আবহাওয়া জানুন। দেশ নাম ঐচ্ছিক।"
  },
  cooldown: 5,
  adminOnly: false,

  execute: async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const city = args[0];
    const country = args[1] ? `,${args[1]}` : '';

    if (!city) {
      return ctx.reply("❓ Please provide a city name. Usage: /weather {city name} [country name]");
    }

    const apiKey = config.openWeatherApiKey;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}${country}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      const weatherData = response.data;

      const weatherInfo = `╭──✦ [ Weather Information for ${weatherData.name}, ${weatherData.sys.country} ]\n` +
                          `├‣ 🌡️ Temperature: ${weatherData.main.temp}°C\n` +
                          `├‣ 🌧️ Weather: ${weatherData.weather[0].description}\n` +
                          `├‣ 🌬️ Wind Speed: ${weatherData.wind.speed} m/s\n` +
                          `├‣ 💨 Humidity: ${weatherData.main.humidity}%\n` +
                          `├‣ 🌡️ Min Temperature: ${weatherData.main.temp_min}°C\n` +
                          `├‣ 🌡️ Max Temperature: ${weatherData.main.temp_max}°C\n` +
                          `├‣ 🌍 Latitude: ${weatherData.coord.lat}\n` +
                          `├‣ 🌍 Longitude: ${weatherData.coord.lon}\n` +
                          `├‣ 📅 Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}\n` +
                          `├‣ 📅 Sunset: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}\n` +
                          `╰──────────────────────◊`;

      ctx.reply(weatherInfo);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        ctx.reply(`❓ City "${city}" not found. Please check the name and try again.`);
      } else {
        ctx.reply(`❌ An error occurred while fetching weather data. Please try again later.`);
      }
    }
  }
};