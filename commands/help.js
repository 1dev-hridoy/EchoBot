const fs = require('fs');
const path = require('path');
const { Markup } = require('telegraf');
const pageSize = 5;

module.exports = {
  name: "help",
  description: "Displays a paginated list of available commands or specific command info",
  author: "Hridoy",
  guide: {
    en: "Send /help to see the available commands or /help {command name} for specific info",
    bn: "/help পাঠিয়ে কমান্ড তালিকা দেখুন অথবা /help {কমান্ড নাম} এর জন্য নির্দিষ্ট তথ্য"
  },
  cooldown: 5,
  adminOnly: false,

  getCommands: () => {
    const commandFiles = fs.readdirSync(path.join(__dirname, './'))
      .filter(file => file.endsWith('.js') && file !== 'help.js');
    
    return commandFiles.map(file => {
      const cmd = require(`./${file}`);
      return { name: cmd.name, description: cmd.description, author: cmd.author, guide: cmd.guide, cooldown: cmd.cooldown, adminOnly: cmd.adminOnly };
    });
  },

  getPageContent: (commands, page, totalPages) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const commandList = commands.slice(start, end).map(cmd => 
      `⚙️ /${cmd.name}: ${cmd.description} (Cooldown: ${cmd.cooldown}s, Admin Only: ${cmd.adminOnly ? 'Yes' : 'No'})`
    ).join('\n') || "No commands available.";
    
    return `📖 **Command List (Page ${page}/${totalPages})**\n\n${commandList}`;
  },

  formatCommandInfo: (command) => {
    return `╭──── [ 🛠️ Command: /${command.name} ]\n` +
           `│\n` +
           `│ ✧ Description: ${command.description}\n` +
           `│ ✧ Author: ${command.author}\n` +
           `│ ✧ Guide: ${command.guide.en}\n` +
           `│ ✧ Cooldown: ${command.cooldown}s\n` +
           `│ ✧ Admin Only: ${command.adminOnly ? 'Yes' : 'No'}\n` +
           `│\n` +
           `╰──────────────────────◊`;
  },

  execute: async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const commands = module.exports.getCommands();
    
    if (args.length > 0) {
      const commandName = args[0];
      const command = commands.find(cmd => cmd.name === commandName);
      if (command) {
        return ctx.reply(module.exports.formatCommandInfo(command));
      } else {
        return ctx.reply(`❓ Command /${commandName} not found.`);
      }
    }

    const totalPages = Math.ceil(commands.length / pageSize);
    const currentPage = 1;
    const content = module.exports.getPageContent(commands, currentPage, totalPages);
    const markup = Markup.inlineKeyboard([
      [
        Markup.button.callback('⬅️ Previous', `help_prev_${currentPage}`),
        Markup.button.callback('Next ➡️', `help_next_${currentPage}`)
      ]
    ]);

    await ctx.reply(content, {
      parse_mode: 'Markdown',
      ...markup
    });
  },

  handleCallback: async (ctx) => {
    const [_, action, page] = ctx.callbackQuery.data.split('_');
    let currentPage = parseInt(page);
    const commands = module.exports.getCommands();
    const totalPages = Math.ceil(commands.length / pageSize);

    if ((action === 'next' && currentPage >= totalPages) || (action === 'prev' && currentPage <= 1)) {
      return await ctx.answerCbQuery('No more pages available in this direction!');
    }

    currentPage = action === 'next' ? currentPage + 1 : currentPage - 1;
    const content = module.exports.getPageContent(commands, currentPage, totalPages);
    const markup = Markup.inlineKeyboard([[
      Markup.button.callback('⬅️ Previous', `help_prev_${currentPage}`),
      Markup.button.callback('Next ➡️', `help_next_${currentPage}`)
    ]]);

    try {
      await ctx.editMessageText(content, { parse_mode: 'Markdown', ...markup });
      await ctx.answerCbQuery();
    } catch (error) {
      if (!error.message.includes('message is not modified')) {
        console.error('Help command error:', error);
        await ctx.answerCbQuery('An error occurred while updating the message');
      }
    }
  }
};