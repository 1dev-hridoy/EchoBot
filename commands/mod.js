module.exports = {
    name: "mod",
    description: "Moderation command for group admins.",
    author: "Hridoy",
    guide: {
      en: "Send /mod {action} {user_id} to manage group members. Actions: ban, kick.",
      bn: "/mod {অ্যাকশন} {ব্যবহারকারীর আইডি} পাঠিয়ে গ্রুপ সদস্যদের পরিচালনা করুন। অ্যাকশন: ব্যান, কিক।"
    },
    cooldown: 5,
    adminOnly: true,
  
    execute: async (ctx) => {
      const args = ctx.message.text.split(' ').slice(1);
      const action = args[0];
      const userId = args[1];
  
      if (!action || !userId) {
        return ctx.reply("❓ Please provide an action (ban/kick) and a user ID. Usage: /mod {action} {user_id}");
      }
  
      try {
        if (action === 'ban') {
          await ctx.telegram.banChatMember(ctx.chat.id, userId);
          ctx.reply(`✅ User with ID ${userId} has been banned from the group.`);
        } else if (action === 'kick') {
          await ctx.telegram.kickChatMember(ctx.chat.id, userId);
          ctx.reply(`✅ User with ID ${userId} has been kicked from the group.`);
        } else {
          ctx.reply("❓ Invalid action. Use 'ban' or 'kick'.");
        }
      } catch (error) {
        console.error('Error executing moderation command:', error);
        ctx.reply(`❌ An error occurred while trying to ${action} the user. Please check the user ID and try again.`);
      }
    }
  };