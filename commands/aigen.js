const axios = require('axios');

module.exports = {
  name: "aigen",
  description: "Generate AI images from text prompts",
  author: "Hridoy",
  guide: {
    en: "Send /aigen {your image description} to generate an AI image",
    bn: "AI ইমেজ তৈরি করতে /aigen {আপনার ইমেজ বর্ণনা} পাঠান"
  },
  cooldown: 10,
  adminOnly: false,

  execute: async (ctx) => {
    try {
      const prompt = ctx.message.text.split(' ').slice(1).join(' ');
      
      if (!prompt) {
        return ctx.reply("❌ Please provide an image description. Usage: /aigen {your image description}");
      }

      const statusMsg = await ctx.reply("🎨 Generating AI image...\n✨ This might take a moment...");
      
      const response = await axios.get(`https://api.nexalo.xyz/image-gen?prompt=${encodeURIComponent(prompt)}`, {
        responseType: 'arraybuffer'
      });

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        null,
        "📤 Sending generated image..."
      );

      await ctx.replyWithPhoto(
        { source: Buffer.from(response.data) },
        { caption: `🎨 Generated image for: "${prompt}"` }
      );

      await ctx.telegram.deleteMessage(ctx.chat.id, statusMsg.message_id);

    } catch (error) {
      console.error('AI Image generation error:', error);
      
      if (error.response?.status === 400) {
        await ctx.reply("❌ Invalid prompt. Please try a different description.");
      } else {
        await ctx.reply("❌ Failed to generate image. Please try again later.");
      }
    }
  }
};