const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const { BOT_TOKEN } = require('../config.json');
const path = require('path');
const keep_alive = require("./keep_alive.js");

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers],
});

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
});

client.login(process.env.TOKEN);
