module.exports = {
  name: "uptime",
  description: "Check bot's uptime and server info",
  author: "Hridoy",
  guide: {
    en: "Send /uptime to check bot's uptime and server information",
    bn: "বটের আপটাইম এবং সার্ভার তথ্য দেখতে /uptime পাঠান"
  },
  cooldown: 5,
  adminOnly: false,
  execute: async (ctx) => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);


    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100;
    const memoryTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100;


    const nodeVersion = process.version;
    const platform = process.platform;
    const cpuUsage = Math.round(process.cpuUsage().user / 1000000);

    const uptimeMessage = `╭──── [ 🤖 Bot Status ]
│
│ ✧Uptime Information:
│ • Days: ${days}
│ • Hours: ${hours}
│ • Minutes: ${minutes}
│ • Seconds: ${seconds}
│
│ ✧Server Information:
│ • Memory Used: ${memoryUsedMB}MB
│ • Memory Total: ${memoryTotalMB}MB
│ • CPU Usage: ${cpuUsage}%
│ • Platform: ${platform}
│ • Node.js: ${nodeVersion}
│
│ ✧Bot Information:
│ • Ping: ${Date.now() - ctx.message.date * 1000}ms
│ • API Latency: ${Math.round(ctx.telegram.ping)}ms
│
╰──────────────────────◊`;
    
    await ctx.reply(uptimeMessage);
  }
} 