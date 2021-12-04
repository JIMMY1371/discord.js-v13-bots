const { Client } = require("discord.js");
const x = require("xfinity");
const client = new Client({
  intents: 32767,
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
const config = require("./config.json");

client.on("ready", () => {
  console.log("Ready");
});
const levels = new x.Leveling({
  embed: true, // either false or true , optional
  color: "AQUA", // optional
});
const { Database } = require("quickmongo"); // can use quick.db but not tested yet

const db = new Database(config.connection);
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "DM" && !message.guild) return;

  if (message.content.startsWith(`${config.prefix}addxp`)) {
    levels.addXp(message, db, 500).then((xp) => {
      message.channel.send(`${message.author.username} you now have ${xp}`); // Chnaeg it if you want
    });
  }
  if (message.content.startsWith(`${config.prefix}remXp`)) {
    levels.remXp(message, db, 500).then((xp) => {
      message.channel.send(`${message.author.username} you now have ${xp}`); // Chnaeg it if you want
    });
  }
  if (message.content.startsWith(`${config.prefix}showXp`)) {
    levels.showXp(message, db).then((xp) => {
      message.channel.send(`${message.author.username} you have ${xp}`); // can be any message
    });
  }
  if (message.content.startsWith(`${config.prefix}addlvl`)) {
    levels.addlvl(message, db, 2).then((lvl) => {
      message.channel.send({ content: `${lvl}` }); // can be any message
    });
  }
  if (message.content.startsWith(`${config.prefix}remlvl`)) {
    levels.remlvl(message, db, 2).then((lvl) => {
      message.channel.send({ content: `${lvl}` }); // can be any message
    });
  }
  if (message.content.startsWith(`${config.prefix}showLevel`)) {
    levels.showLevel(message, db).then((lvl) => {
      message.channel.send({ content: `${lvl}` }); // can be any message
    });
  }
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(config.prefix)) return; //required else xp will be addewd when someone uses your bot

  levels.xp(message, db); // initializes xp system and starts adding xp to db
});
client.login(config.token);
