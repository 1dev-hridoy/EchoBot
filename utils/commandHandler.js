const fs = require('fs');
const path = require('path');
const commands = {};
const commandCooldowns = {};

// Load commands dynamically
fs.readdirSync(path.join(__dirname, '../commands')).forEach(file => {
  if (file.endsWith('.js')) {
    try {
      const command = require(`../commands/${file}`);
      if (command.name) {
        commands[command.name] = command;
      }
    } catch (error) {
      console.error(`Failed to load command ${file}:`, error);
    }
  }
});

const handleCommand = async (ctx) => {
  const args = ctx.message.text.split(' ');
  const commandName = args.shift().slice(1);
  const command = commands[commandName];
  const userId = ctx.from.id;

  if (!command) {
    return ctx.reply('❓ Unknown command. Try using /help.');
  }

  // Check admin permission if required
  const config = require('../config/config.json');
  if (command.adminOnly && !config.adminUserIds.includes(userId.toString())) {
    return ctx.reply("⛔ You don't have permission to use this command.");
  }

  // Check command cooldown
  const now = Date.now();
  if (commandCooldowns[commandName]?.[userId]) {
    const remainingTime = commandCooldowns[commandName][userId] - now;
    if (remainingTime > 0) {
      return ctx.reply(`⏳ Please wait ${Math.ceil(remainingTime / 1000)}s before using this command again.`);
    }
  }

  try {
    await command.execute(ctx, args);
    commandCooldowns[commandName] = commandCooldowns[commandName] || {};
    commandCooldowns[commandName][userId] = now + (command.cooldown * 1000 || 3000);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    ctx.reply('❌ An error occurred while executing this command.');
  }
};

const handleCallback = async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  const [commandName] = callbackData.split('_');
  const command = commands[commandName];

  if (command && command.handleCallback) {
    try {
      await command.handleCallback(ctx);
      await ctx.answerCbQuery();
    } catch (error) {
      console.error(`Error handling callback for ${commandName}:`, error);
      await ctx.answerCbQuery('❌ An error occurred');
    }
  }
};

module.exports = {
  handleCommand,
  handleCallback
};
