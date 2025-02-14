module.exports = {
  name: "mod",
  description: "Moderation commands for group admins.",
  author: "Hridoy",
  guide: {
    en: "Send /mod {action} {user_id} to manage group members. Actions: ban, kick, mute, unmute, promote, warn, unban, restrict, unrestrict, demote.",
    bn: "/mod {অ্যাকশন} {ব্যবহারকারীর আইডি} পাঠিয়ে গ্রুপ সদস্যদের পরিচালনা করুন। অ্যাকশন: ব্যান, কিক, মিউট, আনমিউট, প্রোমোট, ওয়ার্ন, আনবান, রেস্ট্রিক্ট, আনরেস্ট্রিক্ট, ডিমোট।"
  },
  cooldown: 5,
  adminOnly: true,

  execute: async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const action = args[0];
    const userId = args[1];

    console.log("Received arguments:", args); // Debugging line

    if (!action || !userId) {
      return ctx.reply("❓ Please provide an action (ban/kick/mute/unmute/promote/warn/unban/restrict/unrestrict/demote) and a user ID. Usage: /mod {action} {user_id}");
    }

    if (ctx.chat.type !== 'supergroup') {
      return ctx.reply("❌ This command can only be used in supergroups.");
    }

    // Check if the user is a group admin
    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    if (member.status !== 'administrator' && member.status !== 'creator') {
      return ctx.reply("❌ You must be a group admin to use this command.");
    }

    // Check if the bot is an admin
    const botMember = await ctx.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id);
    if (botMember.status !== 'administrator') {
      return ctx.reply("❌ I must be an admin in this group to execute this command.");
    }

    try {
      switch (action) {
        case 'ban':
          console.log(`Attempting to ban user with ID ${userId}`); // Debugging line
          await ctx.telegram.banChatMember(ctx.chat.id, userId);
          ctx.reply(`✅ User with ID ${userId} has been banned from the group.`);
          break;
        case 'kick':
          console.log(`Attempting to kick user with ID ${userId}`); // Debugging line
          await ctx.telegram.kickChatMember(ctx.chat.id, userId);
          ctx.reply(`✅ User with ID ${userId} has been kicked from the group.`);
          break;
        case 'mute':
          console.log(`Attempting to mute user with ID ${userId}`); // Debugging line
          await ctx.telegram.restrictChatMember(ctx.chat.id, userId, { can_send_messages: false });
          ctx.reply(`✅ User with ID ${userId} has been muted in the group.`);
          break;
        case 'unmute':
          console.log(`Attempting to unmute user with ID ${userId}`); // Debugging line
          await ctx.telegram.restrictChatMember(ctx.chat.id, userId, { can_send_messages: true });
          ctx.reply(`✅ User with ID ${userId} has been unmuted in the group.`);
          break;
        case 'promote':
          console.log(`Attempting to promote user with ID ${userId}`); // Debugging line
          await ctx.telegram.promoteChatMember(ctx.chat.id, userId, {
            can_change_info: true,
            can_delete_messages: true,
            can_invite_users: true,
            can_restrict_members: true,
            can_pin_messages: true,
            can_promote_members: false,
          });
          ctx.reply(`✅ User with ID ${userId} has been promoted to admin in the group.`);
          break;
        case 'warn':
          console.log(`Attempting to warn user with ID ${userId}`); // Debugging line
          // Implement your own warning logic here
          ctx.reply(`⚠️ User with ID ${userId} has been warned.`);
          break;
        case 'unban':
          console.log(`Attempting to unban user with ID ${userId}`); // Debugging line
          await ctx.telegram.unbanChatMember(ctx.chat.id, userId);
          ctx.reply(`✅ User with ID ${userId} has been unbanned from the group.`);
          break;
        case 'restrict':
          console.log(`Attempting to restrict user with ID ${userId}`); // Debugging line
          await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
            can_send_messages: true,
            can_send_media_messages: false,
            can_send_polls: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
          });
          ctx.reply(`✅ User with ID ${userId} has been restricted from sending media.`);
          break;
        case 'unrestrict':
          console.log(`Attempting to unrestrict user with ID ${userId}`); // Debugging line
          await ctx.telegram.restrictChatMember(ctx.chat.id, userId, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
          });
          ctx.reply(`✅ User with ID ${userId} has been unrestricted.`);
          break;
        case 'demote':
          console.log(`Attempting to demote user with ID ${userId}`); // Debugging line
          await ctx.telegram.promoteChatMember(ctx.chat.id, userId, {
            can_change_info: false,
            can_delete_messages: false,
            can_invite_users: false,
            can_restrict_members: false,
            can_pin_messages: false,
            can_promote_members: false,
          });
          ctx.reply(`✅ User with ID ${userId} has been demoted to regular member.`);
          break;
        default:
          ctx.reply("❓ Invalid action. Use 'ban', 'kick', 'mute', 'unmute', 'promote', 'warn', 'unban', 'restrict', 'unrestrict', or 'demote'.");
      }
    } catch (error) {
      console.error('Error executing moderation command:', error);
      ctx.reply(`❌ An error occurred while trying to ${action} the user. Please check the user ID and try again.`);
    }
  }
};