const { Client, MessageAttachment } = require("discord.js");
const x = require("xfinity");
const client = new Client({
  intents: 32767,
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
const config = require("./config.json");

x.handleinteraction(client);
client.on("ready", () => {
  console.log("Ready");
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "DM" && !message.guild) return;

  if (message.content.startsWith(`${config.prefix}ticket`)) {
    if (!config.type) throw new Error("Type of system not specified.");
    if (config.type === "button") {
      x.bTicket(message);
    } else if (config.type === "menu") {
      x.mTicket(message);
    } else if (config.type === "thread") {
      x.threadTicket(message);
    }
  }
});
client.login(config.token);
