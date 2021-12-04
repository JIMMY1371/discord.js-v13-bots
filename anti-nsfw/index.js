const { AntiNsfwClient } = require("discord-antinsfw");
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: 32767,
});
const nsfw = new AntiNsfwClient();
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("messageCreate", (message) => {
  nsfw.init(message);
});
client.login(require("./config.json").token);
nsfw.on("nsfw", async (message, data) => {
  if (data.isNSFW) {
    await message.delete();
    const embed = new Discord.MessageEmbed()
      .setTitle("NSFW Image Detected")
      .setColor("#ff0000")
      .setDescription(
        `
        Channel: ${message.channel}
        Author: ${message.author}
        Detections: ${data.detections.join(", ")}
        Points: ${data.point}
      `
      )
      .setImage(message.attachments.first().url)
      .setTimestamp()
      .setFooter(`I was ${data.confidence} confident`);
    message.channel.send({ embeds: [embed] });
  }
});
