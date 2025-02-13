const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const config = require('./config/config.json');
const { handleCommand, handleCallback } = require('./utils/commandHandler');
const { addUserIfNotExists } = require('./database/userService');

const bot = new Telegraf(config.botToken);

// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Bot starting message
console.log(`
┌─────────────────────────────────────────────┐
🎯  𝗛𝗿𝗶𝗱𝗼𝘆 𝗕𝗼𝘁 🚀
💜  𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 🇪‌🇨‌🇭‌🇴‌🇧‌🇴‌🇹‌ 𝗯𝘆 𝗛𝗿𝗶𝗱𝗼𝘆 𝗞𝗵𝗮𝗻
💥  𝗕𝗼𝘁 𝗶𝘀 𝗦𝘁𝗮𝗿𝘁𝗶𝗻𝗴...
└─────────────────────────────────────────────┘
`);

bot.on('text', async (ctx) => {
  const text = ctx.message.text;

  // Add user if not exists
  const isNewUser = await addUserIfNotExists(ctx);

  // Command handling
  if (text.startsWith('/')) {
    await handleCommand(ctx);
  }

  // Logging user messages
  const user = `${ctx.from.first_name} (@${ctx.from.username || 'N/A'})`;
  const time = new Date().toLocaleString();
  const messageType = ctx.message.text ? 'Text' : 'Unknown';
  const content = ctx.message.text || 'N/A';

  console.log(`
✉ 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗟𝗼𝗴 📜
☀ 𝗧𝗶𝗺𝗲: ${time}
⁂ 𝗨𝘀𝗲𝗿: ${user}
₪ 𝗧𝘆𝗽𝗲: ${messageType}
ლ 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${content}
${isNewUser ? '🎉 New user added to the database!' : '🔄 Existing user recognized.'}
─────────────────────────────────────────────
  `);
});

// Handle callback queries
bot.on('callback_query', handleCallback);

// Launch the bot
bot.launch()
  .then(() => {
    console.log('🚀 Bot is running...');
  })
  .catch((err) => {
    console.error('❌ Error starting bot:', err);
  });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
