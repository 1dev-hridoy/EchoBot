module.exports = {
    name: "start",
    description: "Start the bot and register the user if new",
    author: "Hridoy",
    guide: {
      en: "Send /start to initialize the bot and get a welcome message",
      bn: "বটটি শুরু করতে এবং স্বাগত বার্তা পেতে /start পাঠান"
    },
    cooldown: 5,
    adminOnly: false,
    execute: async (ctx) => {
      const { addUserIfNotExists } = require('../database/userService');
      const config = require('../config/config.json');
  
      const isNewUser = await addUserIfNotExists(ctx);
      if (isNewUser) {
        await ctx.reply(`🎉 Welcome to ${config.botname}! We're glad to have you here! 🌟`);
      } else {
        await ctx.reply(`👋 Welcome back to ${config.botname}! 🚀`);
      }
    }
  };
  