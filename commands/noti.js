const User = require('../database/userModel');

module.exports = {
  name: "noti",
  description: "Send a notification to all users.",
  author: "Hridoy",
  guide: {
    en: "Send /noti {message} to notify all users.",
    bn: "/noti {বার্তা} পাঠিয়ে সকল ব্যবহারকারীদের জানিয়ে দিন।"
  },
  cooldown: 5,
  adminOnly: true,

  execute: async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const message = args.join(' ');

    if (!message) {
      return ctx.reply("❓ Please provide a message to send.");
    }

    try {
      const users = await User.find(); // Retrieve all users from the database
      users.forEach(user => {
        ctx.telegram.sendMessage(user.userId, message)
          .catch(err => console.error(`Failed to send message to ${user.userId}:`, err));
      });
      ctx.reply("✅ Notification sent to all users.");
    } catch (error) {
      console.error('Error retrieving users:', error);
      ctx.reply("❌ An error occurred while sending notifications. Please try again later.");
    }
  }
};