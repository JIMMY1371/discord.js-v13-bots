const { Client, MessageAttachment } = require("discord.js");
const x = require("xfinity");
const client = new Client({
  intents: 32767,
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
const config = require("./config.json");

client.on("ready", () => {
  console.log("Ready");
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "DM" && !message.guild) return;

  if (message.content.startsWith(`${config.prefix}tr`)) {
    x.fetchTranscript(message.channel, message, 5).then((data) => {
      const file = new MessageAttachment(data, "index.html");
      message.channel.send({ files: [file] });
    });
  }
});
client.login(config.token);
