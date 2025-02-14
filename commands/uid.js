module.exports = {
    name: "uid",
    description: "Get user ID of the command sender or mentioned user.",
    author: "Hridoy",
    guide: {
      en: "Send /uid to get your user ID, reply to a message with /uid to get that user's ID.",
      bn: "/uid পাঠিয়ে আপনার ব্যবহারকারীর আইডি পান, একটি বার্তার উত্তর দিয়ে /uid পাঠিয়ে সেই ব্যবহারকারীর আইডি পান।"
    },
    cooldown: 5,
    adminOnly: false,
  
    execute: async (ctx) => {
      const replyToMessage = ctx.message.reply_to_message;
      if (replyToMessage) {
        const userId = replyToMessage.from.id;
        return ctx.reply(`╭──✦ [ User ID Information ]\n├‣ 🔍 User ID of the replied user: ${userId}\n╰──────────────────────◊`);
      } else {
        const userId = ctx.from.id;
        return ctx.reply(`╭──✦ [ Your User ID Information ]\n├‣ 🔍 Your User ID: ${userId}\n╰──────────────────────◊`);
      }
    }
  };