const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config.json');
const { addUserIfNotExists } = require('../database/userService');
const User = require('../database/userModel');
const musicData = require('../assets/music.json');
const cron = require('node-cron');
const moment = require('moment-timezone');

const activeJobs = new Map();

function getRandomMusic(weatherCondition) {
  let condition = 'clear';
  if (weatherCondition.toLowerCase().includes('rain')) {
    condition = 'rain';
  } else if (weatherCondition.toLowerCase().includes('snow')) {
    condition = 'snow';
  }
  const musicList = musicData[condition];
  return musicList[Math.floor(Math.random() * musicList.length)];
}

async function downloadMusic(url, filename) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer'
  });
  await fs.writeFile(filename, response.data);
  return filename;
}

function formatWeatherInfo(weatherData, musicName = null) {
  let info = `╭──✦ [ Weather Information for ${weatherData.name}, ${weatherData.sys.country} ]\n` +
             `├‣ 🌡️ Temperature: ${weatherData.main.temp}°C\n` +
             `├‣ 🌧️ Weather: ${weatherData.weather[0].description}\n` +
             `├‣ 🌬️ Wind Speed: ${weatherData.wind.speed} m/s\n` +
             `├‣ 💨 Humidity: ${weatherData.main.humidity}%\n` +
             `├‣ 🌡️ Min Temperature: ${weatherData.main.temp_min}°C\n` +
             `├‣ 🌡️ Max Temperature: ${weatherData.main.temp_max}°C\n` +
             `├‣ 🌍 Latitude: ${weatherData.coord.lat}\n` +
             `├‣ 🌍 Longitude: ${weatherData.coord.lon}\n` +
             `├‣ 📅 Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}\n` +
             `├‣ 📅 Sunset: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}`;

  if (musicName) {
    info += `\n├‣ 🎵 Recommended Music: ${musicName}`;
  }

  info += '\n╰──────────────────────◊';
  return info;
}

async function sendWeatherUpdate(ctx, user) {
  try {
    const currentTime = moment().tz('Asia/Dhaka');
    const timeStr = currentTime.format('HH:mm');
    
    const apiKey = config.openWeatherApiKey;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${user.city},${user.country}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const weatherData = response.data;
    const musicName = getRandomMusic(weatherData.weather[0].description);
    const musicResponse = await axios.get(`https://api.nexalo.xyz/ytbmain?songname=${encodeURIComponent(musicName)}`);
    const musicLink = musicResponse.data.data.link;

    const tempFileName = path.join(__dirname, `../temp/${Date.now()}.mp3`);
    await downloadMusic(musicLink, tempFileName);

    const weatherInfo = formatWeatherInfo(weatherData, musicName);

    await ctx.telegram.sendMessage(user.userId, `⏰ ${timeStr} Weather Update\n${weatherInfo}`);
    await ctx.telegram.sendAudio(user.userId, { source: tempFileName });

    await fs.unlink(tempFileName);
  } catch (error) {
    console.error(`Error in weather update for ${user.firstName}:`, error.message);
    ctx.telegram.sendMessage(user.userId, 'An error occurred while updating weather. Will try in next scheduled time.');
  }
}

function startScheduledUpdates(ctx, user) {
  if (activeJobs.has(user.userId)) {
    activeJobs.get(user.userId).forEach(job => job.stop());
  }

  const jobs = [
    cron.schedule('0 7 * * *', () => sendWeatherUpdate(ctx, user), { timezone: 'Asia/Dhaka' }),
    cron.schedule('0 12 * * *', () => sendWeatherUpdate(ctx, user), { timezone: 'Asia/Dhaka' }),
    cron.schedule('0 19 * * *', () => sendWeatherUpdate(ctx, user), { timezone: 'Asia/Dhaka' })
  ];

  activeJobs.set(user.userId, jobs);
  
  const nextUpdateTime = getNextUpdateTime();
  return nextUpdateTime;
}

function getNextUpdateTime() {
  const current = moment().tz('Asia/Dhaka');
  const times = [
    moment().tz('Asia/Dhaka').hours(7).minutes(0).seconds(0),
    moment().tz('Asia/Dhaka').hours(12).minutes(0).seconds(0),
    moment().tz('Asia/Dhaka').hours(19).minutes(0).seconds(0)
  ];

  for (let time of times) {
    if (time.isAfter(current)) {
      return time.format('HH:mm');
    }
  }
  return times[0].add(1, 'day').format('HH:mm');
}

module.exports = {
  name: "weather",
  description: "Get weather updates with music recommendations",
  author: "Hridoy",
  guide: {
    en: "Send /weather {city name} {country name} or /weather update {city name} {country name} for scheduled weather updates",
    bn: "/weather {শহরের নাম} {দেশের নাম} অথবা /weather update {শহরের নাম} {দেশের নাম} পাঠিয়ে নির্ধারিত সময়ে আবহাওয়া আপডেট পান"
  },
  cooldown: 5,
  adminOnly: false,

  execute: async (ctx) => {
    try {
      const args = ctx.message.text.split(' ').slice(1);
      const isUpdate = args[0]?.toLowerCase() === 'update';
      
      if (!isUpdate && args.length >= 2) {
        const city = args[0];
        const country = args[1];

        await User.findOneAndUpdate(
          { userId: ctx.from.id },
          { 
            $set: { 
              city: city,
              country: country,
              lastLocationUpdate: new Date()
            }
          },
          { upsert: true }
        );

        const user = await User.findOne({ userId: ctx.from.id });
        const nextUpdate = startScheduledUpdates(ctx, user);
        await sendWeatherUpdate(ctx, user);
        return ctx.reply(`✅ Weather updates scheduled for 7:00 AM, 12:00 PM, and 7:00 PM (Bangladesh Time)\nNext update at: ${nextUpdate}`);
      }
      
      if (isUpdate) {
        const city = args[1];
        const country = args[2];

        if (!city || !country) {
          return ctx.reply("❓ Please provide both city and country. Usage: /weather update {city name} {country name}");
        }

        await User.findOneAndUpdate(
          { userId: ctx.from.id },
          { 
            $set: { 
              city: city,
              country: country,
              lastLocationUpdate: new Date()
            }
          },
          { upsert: true }
        );

        const user = await User.findOne({ userId: ctx.from.id });
        const nextUpdate = startScheduledUpdates(ctx, user);
        await sendWeatherUpdate(ctx, user);
        return ctx.reply(`✅ Weather updates scheduled for 7:00 AM, 12:00 PM, and 7:00 PM (Bangladesh Time)\nNext update at: ${nextUpdate}`);
      }

      return ctx.reply("❓ Please provide city and country. Usage: /weather {city name} {country name}");

    } catch (error) {
      if (error.response?.status === 404) {
        ctx.reply('❌ City not found. Please check the city and country names.');
      } else {
        ctx.reply('❌ An error occurred while processing your request. Please try again later.');
      }
    }
  }
};