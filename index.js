const { Telegraf } = require('telegraf')
const config = require('./config/config.json')
const commandHandler = require('./utils/commandHandler')

const bot = new Telegraf(config.botToken)

console.log(`
┌─────────────────────────────────────────────┐
🎯  𝗛𝗿𝗶𝗱𝗼𝘆 𝗕𝗼𝘁 🚀
💜  𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 🇪‌🇨‌🇭‌🇴‌🇧‌🇴‌🇹‌ 𝗯𝘆 𝗛𝗿𝗶𝗱𝗼𝘆 𝗞𝗵𝗮𝗻
💥  𝗕𝗼𝘁 𝗶𝘀 𝗦𝘁𝗮𝗿𝘁𝗶𝗻𝗴...
└─────────────────────────────────────────────┘
`)

bot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('/')) {
    await commandHandler(ctx)
  }

  const user = `${ctx.from.first_name} (@${ctx.from.username || 'N/A'})`
  const time = new Date().toLocaleString()
  const messageType = ctx.message.text ? 'Text' : 'Unknown'
  const content = ctx.message.text || 'N/A'

  console.log(`
✉ 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗟𝗼𝗴 📜
☀ 𝗧𝗶𝗺𝗲: ${time}
⁂ 𝗨𝘀𝗲𝗿: ${user}
₪ 𝗧𝘆𝗽𝗲: ${messageType}
ლ 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${content}
─────────────────────────────────────────────
`)
})

bot.launch()

console.log(`
┌─────────────────────────────────────────────┐
✅  𝗕𝗼𝘁 𝗦𝘁𝗮𝗿𝘁𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!
🌐  𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${config.botname}
👨‍💼  𝗢𝘄𝗻𝗲𝗿: ${config.ownerName}
🕒  𝗧𝗶𝗺𝗲: ${new Date().toLocaleString()}
└─────────────────────────────────────────────┘
`);
