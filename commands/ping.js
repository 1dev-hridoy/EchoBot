module.exports = {
    name: "ping",
    description: "Check bot's responsiveness",
    author: "Hridoy",
    guide: {
      en: "Send /ping to check the bot's response time",
      bn: "বটের প্রতিক্রিয়া সময় পরীক্ষা করতে /ping পাঠান"
    },
    cooldown: 5,
    adminOnly: false,
    execute: async (ctx) => {
      const start = Date.now()
      const message = await ctx.reply("Pinging...")
      const latency = Date.now() - start
      await ctx.telegram.editMessageText(ctx.chat.id, message.message_id, null, `Pong! ${latency}ms`)
    }
  }
  