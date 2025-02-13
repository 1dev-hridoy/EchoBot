const fs = require('fs')
const path = require('path')
const commands = {}
const commandCooldowns = {}

fs.readdirSync(path.join(__dirname, '../commands')).forEach(file => {
  const command = require(`../commands/${file}`)
  commands[command.name] = command
})

module.exports = async (ctx) => {
  const args = ctx.message.text.split(' ')
  const commandName = args.shift().slice(1)
  const command = commands[commandName]
  if (!command) return
  const userId = ctx.from.id

  if (command.adminOnly && !require('../config/config.json').adminUserIds.includes(userId.toString())) {
    return ctx.reply("You don't have permission to use this command.")
  }

  if (commandCooldowns[commandName] && commandCooldowns[commandName][userId]) {
    const remainingTime = commandCooldowns[commandName][userId] - Date.now()
    if (remainingTime > 0) return ctx.reply(`Please wait ${Math.ceil(remainingTime / 1000)}s`)
  }

  commandCooldowns[commandName] = commandCooldowns[commandName] || {}
  commandCooldowns[commandName][userId] = Date.now() + command.cooldown * 1000

  await command.execute(ctx, args)
}
