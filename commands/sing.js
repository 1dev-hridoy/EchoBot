const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  name: "sing",
  description: "Search and play music from YouTube",
  author: "Hridoy",
  guide: {
    en: "Send /sing {song name} to search and play music",
    bn: "মিউজিক খুঁজে শোনার জন্য /sing {গানের নাম} পাঠান"
  },
  cooldown: 5,
  adminOnly: false,

  execute: async (ctx) => {
    try {
      const query = ctx.message.text.split(' ').slice(1).join(' ');
      
      if (!query) {
        return ctx.reply("❌ Please provide a song name. Usage: /sing {song name}");
      }

      const statusMsg = await ctx.reply("🔍 Searching for music...");
      
      const musicResponse = await axios.get(`https://api.nexalo.xyz/ytbmain?songname=${encodeURIComponent(query)}`);
      
      if (!musicResponse.data.data.link) {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          "❌ No music found. Please try a different search term."
        );
        return;
      }

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        null,
        "⬇️ Downloading music..."
      );

      const tempFileName = path.join(__dirname, `../temp/${Date.now()}.mp3`);
      
      const response = await axios({
        method: 'GET',
        url: musicResponse.data.data.link,
        responseType: 'arraybuffer'
      });

      await fs.writeFile(tempFileName, response.data);

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        null,
        "📤 Sending music..."
      );

      await ctx.replyWithAudio(
        { source: tempFileName },
        { 
          title: musicResponse.data.data.title || query,
          performer: "Requested via Sing Command"
        }
      );

      await ctx.telegram.deleteMessage(ctx.chat.id, statusMsg.message_id);
      await fs.unlink(tempFileName);

    } catch (error) {
      console.error('Sing command error:', error);
      
      if (statusMsg) {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          "❌ An error occurred while processing your request. Please try again."
        ).catch(() => {});
      } else {
        await ctx.reply("❌ An error occurred while processing your request. Please try again.");
      }
    }
  }
};