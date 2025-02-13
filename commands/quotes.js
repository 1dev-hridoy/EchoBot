const axios = require('axios');

module.exports = {
  name: "quotes",
  description: "Get random programming quotes",
  author: "Hridoy",
  guide: {
    en: "Send /quotes to get a random programming quote",
    bn: "একটি র্যান্ডম প্রোগ্রামিং উক্তি পেতে /quotes পাঠান"
  },
  cooldown: 5,
  adminOnly: false,

  execute: async (ctx) => {
    try {
      const statusMsg = await ctx.reply("🔍 Fetching a quote...");
      
      const response = await axios.get('https://programming-quotes-api.azurewebsites.net/api/quotes/random');
      const quote = response.data;
      
      const formattedQuote = `╭──✦ [ Programming Quote ]\n` +
                            `├‣ 💭 ${quote.text}\n` +
                            `├‣ 👤 ${quote.author}\n` +
                            `╰──────────────────────◊`;
      
      await ctx.telegram.deleteMessage(ctx.chat.id, statusMsg.message_id);
      await ctx.reply(formattedQuote);
      
    } catch (error) {
      console.error('Quotes command error:', error);
      await ctx.reply("❌ Failed to fetch a quote. Please try again later.");
    }
  }
};