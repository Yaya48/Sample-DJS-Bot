const { Client, Collection } = require("discord.js");
const { TOKEN, PREFIX,} = require("../config.json");
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cooldowns = new Collection();

module.exports = async (client, message) => {
  if (message.author.bot) return;

  const prefix = PREFIX
  // On with ye old other... stuff

  client.prefix = PREFIX;
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;

  if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`)))
    return message.channel.send(
      `The prefix is set to: \`${PREFIX}\``
    );

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content
    .slice(matchedPrefix.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );

    if (!command) return message.channel.send(`Error command not found type ${PREFIX}help for view available commands.`);
    if (!cooldowns.has(command.name))
      cooldowns.set(command.name, new Collection());

    if (command.disabled) return;

    try {
      command.execute(client, message, args);
    } catch (error) {
      catchError(error, message);
    }
  }
