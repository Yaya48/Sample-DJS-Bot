const { Client, Collection, Discord } = require("discord.js");
const client = new Client({ partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER']});
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN } = require("./config.json");
const fs = require("fs");
// or use es6 import statements
// import * as Sentry from '@sentry/node';


client.login(TOKEN);
client.commands = new Collection();
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function catchError(error, message) {
  
  return message.channel.send(
    "There was an error. The bot owner has been notified."
  );
}

// Command file setup
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
commandCount = commandFiles.length
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

// event files setup.

fs.readdir("./events/", (err, files) => {
  if (err) return console.error;
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const evt = require(`./events/${file}`);
    let evtName = file.split(".")[0];
    console.log(`Loaded event '${evtName}'`);
    client.on(evtName, evt.bind(null, client));
  });
});