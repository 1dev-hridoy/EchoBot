# 🤖 EchoBot

<p align="center">
<img src="https://img.shields.io/badge/Node.js%20Support-20.x-blue" alt="Node.js Support">
<img src="https://img.shields.io/badge/project_version-7ZHV92MN4L-red" alt="Project Version">
<img src="https://img.shields.io/badge/code_version-1.0.0-yellow" alt="Code Version">
<img src="https://img.shields.io/badge/license-MIT-gray" alt="MIT LICENSE">
</p>

<p align="center">
<img src="https://github.com/user-attachments/assets/3d145273-b9a0-4bb4-94f6-fcee65506040" alt="EchoBot Banner" width="600">

</p>

## 📝 Description

EchoBot is a feature-rich Telegram bot built using Node.js and the Telegraf framework. It provides a wide range of functionalities from user management to weather updates, making it a versatile addition to any Telegram group or personal chat.

## ✨ Features

### Core Features
- **🔐 User Registration**: Automatic user registration system
- **🌤️ Weather Updates**: Real-time weather information with music recommendations
- **👮 Group Moderation**: Comprehensive group management tools
- **📢 Notifications**: Global announcement system for admins
- **🎵 Music Recommendations**: Weather-based music suggestions
- **🤖 AI Image Generation**: Create AI-powered images from text prompts
- **💭 Random Quotes**: Inspirational programming quotes
- **🎵 Music Search**: Search and send music based on user input

### Advanced Features
- **⏰ Scheduled Updates**: Automated weather notifications
- **🌍 Multi-language Support**: Supports English and Bengali
- **🔄 Command Cooldown**: Rate limiting for command usage
- **👑 Admin Privileges**: Special commands for administrators
- **📊 User Analytics**: Track user interactions and preferences

## 🛠️ Technical Stack

- **Runtime**: Node.js 20.x
- **Framework**: Telegraf
- **Database**: MongoDB
- **APIs**: OpenWeather API
- **Dependencies**: 
  - axios
  - moment.js
  - node-cron
  - mongoose

## 📁 Project Structure

```
EchoBot/
├── commands/                 # Command handlers
│   ├── aigen.js             # AI image generation
│   ├── help.js             # Command list & help
│   ├── mod.js              # Moderation tools
│   ├── noti.js            # Global notifications
│   ├── ping.js            # Bot status check
│   ├── quotes.js          # Programming quotes
│   ├── sing.js            # Music search
│   ├── start.js           # Welcome command
│   ├── uid.js             # User ID lookup
│   └── weather.js         # Weather updates
│
├── config/                  # Configuration files
│   ├── config.json        # Bot settings
│   └── example.config.json # Template config
│
├── database/               # Database related
│   ├── userModel.js       # User schema
│   └── userService.js     # DB operations
│
├── assets/                 # Static resources
│   └── music.json         # Music data
│
├── utils/                  # Utility functions
│   └── commandHandler.js   # Command processor
│
├── index.js               # Main entry point
└── README.md              # Documentation
```

## 📚 Command Examples

### Simple Commands
```bash
/start         # Initialize the bot
/help          # View all commands
/ping          # Check bot status
/uid           # Get user ID
/quotes        # Get random quote
```

### Advanced Commands
```bash
/weather [city]          # Get weather updates
/noti [message]         # Send global notification
/mod [action] [userID]  # Moderate users
/aigen [prompt]         # Generate AI images
/sing [song name]       # Search and send music
```

## 🔧 Creating Commands

### Basic Command Structure
```javascript
module.exports = {
  name: "commandname",
  description: "Brief description of what the command does",
  author: "Your Name",
  guide: {
    en: "How to use the command in English",
    bn: "How to use the command in Bengali"
  },
  cooldown: 5,
  adminOnly: false,

  execute: async (ctx) => {
    // Your command logic here
    await ctx.reply("Hello, World!");
  }
};
```

### Command with Arguments
```javascript
module.exports = {
  name: "greet",
  description: "Greet a user with custom message",
  execute: async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const message = args.join(' ') || 'Hello';
    await ctx.reply(`${message}, ${ctx.from.first_name}!`);
  }
};
```

### Admin-Only Command
```javascript
module.exports = {
  name: "admin",
  description: "Admin only command example",
  adminOnly: true,
  execute: async (ctx) => {
    const config = require('../config/config.json');
    if (!config.adminUserIds.includes(ctx.from.id.toString())) {
      return ctx.reply("❌ This command is only for admins!");
    }
    await ctx.reply("Welcome, admin!");
  }
};
```

### Command with Database Interaction
```javascript
const User = require('../database/userModel');

module.exports = {
  name: "profile",
  description: "View user profile",
  execute: async (ctx) => {
    try {
      const user = await User.findOne({ userId: ctx.from.id });
      if (!user) {
        return ctx.reply("Profile not found!");
      }
      await ctx.reply(`
╭──✦ [ User Profile ]
│ 
│ 📋 Name: ${ctx.from.first_name}
│ 🆔 ID: ${user.userId}
│ 📅 Joined: ${user.joinDate}
│ 
╰──────────────────────◊`);
    } catch (error) {
      ctx.reply("❌ Error fetching profile!");
    }
  }
};
```

### Command with API Integration
```javascript
const axios = require('axios');

module.exports = {
  name: "weather",
  description: "Get weather information",
  execute: async (ctx) => {
    const config = require('../config/config.json');
    const city = ctx.message.text.split(' ').slice(1).join(' ');
    
    if (!city) {
      return ctx.reply("Please provide a city name!");
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.openWeatherApiKey}&units=metric`
      );
      
      const weather = response.data;
      await ctx.reply(`
╭──✦ [ Weather Info: ${city} ]
│ 
│ 🌡️ Temperature: ${weather.main.temp}°C
│ 💨 Wind: ${weather.wind.speed} m/s
│ 💧 Humidity: ${weather.main.humidity}%
│ 
╰──────────────────────◊`);
    } catch (error) {
      ctx.reply("❌ Error fetching weather data!");
    }
  }
};
```

### Command with Music Search
```javascript
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "sing",
  description: "Search and send music based on user input",
  author: "Hridoy",
  guide: {
    en: "Send /sing [song name] to search and receive music",
    bn: "গান খুঁজতে এবং পেতে /sing [গানের নাম] পাঠান"
  },
  cooldown: 5,
  adminOnly: false,

  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ');
    
    if (!query) {
      return ctx.reply("❓ Please provide a song name to search!");
    }

    try {
      await ctx.reply(`🔍 Searching for: ${query}`);
      
      // Search for the music
      const music = await searchMusic(query);
      
      if (!music) {
        return ctx.reply("❌ No music found for your search!");
      }

      // Send the music file
      await ctx.replyWithAudio({
        source: music.filePath,
        filename: music.title
      }, {
        caption: `
╭──✦ [ 🎵 Music Found ]
│ 
│ 🎧 Title: ${music.title}
│ 👤 Artist: ${music.artist}
│ ⏱️ Duration: ${music.duration}
│ 
╰──────────────────────◊`
      });
    } catch (error) {
      console.error('Error in sing command:', error);
      ctx.reply("❌ Error while searching for music!");
    }
  }
};
```

## 🚀 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/1dev-hridoy/EchoBot.git
   cd EchoBot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure the Bot**
   - Rename `example.config.json` to `config.json`
   - Update the following in `config.json`:
     - `botToken`: Your Telegram bot token
     - `mongoURI`: MongoDB connection string
     - `openWeatherApiKey`: OpenWeather API key
     - `adminUserIds`: Array of admin Telegram IDs

4. **Start the Bot**
   ```bash
   node index.js
   ```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, join our [Telegram](https://t.me/BD_NOOBRA) or open an issue in the repository.

## 👨‍💻 Developer

- **Name**: Hridoy Khan
- **Telegram**: [@1devHridoy](https://t.me/BD_NOOBRA)
- **GitHub**: [1dev-hridoy](https://github.com/1dev-hridoy)

---
<p align="center">Made with ❤️ by Hridoy Khan</p>
