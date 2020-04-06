const Discord = require('discord.js');
const client = new Discord.Client();
const API = require('./api-controller.js');
const Database = require('./db.js');
const config = require("./config.json");


client.on("ready", () => {
  console.log(`Online!`);
  client.user.setActivity(`-rankme`, {
    type: "LISTENING"
  });
  Database.sql.run(`CREATE TABLE IF NOT EXISTS nick (ServerID TEXT, UserID TEXT, Fortnite TEXT, Platform TEXT)`);
});

client.on('message', msg => {
  if (msg.author.bot) return;
  if (msg.content.indexOf(config.prefix) !== 0) return;
  if (msg.channel.id == config.rankChannel) {
    if (msg.content.startsWith(config.prefix)) {
      const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      switch (command) {
        case 'nick':
          API.link(msg, args);
          break;
        case 'rankme':
          API.stats(msg);
          break;
      }
    }
  }
});

client.login(config.token);
