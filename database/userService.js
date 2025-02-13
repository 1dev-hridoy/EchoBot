const User = require('./userModel');

async function addUserIfNotExists(ctx) {
  const userId = ctx.from.id;
  const user = await User.findOne({ userId });

  if (!user) {
    const newUser = new User({
      userId: userId,
      username: ctx.from.username || 'N/A',
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name || '',
      createdAt: new Date()
    });
    await newUser.save();
    console.log(`🎉 New user added: ${ctx.from.first_name} (@${ctx.from.username || 'N/A'})`);
    return true;
  }
  return false;
}

module.exports = { addUserIfNotExists };
