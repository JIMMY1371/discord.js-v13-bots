const { AntiAltClient } = require("discord-antialts");
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: 32767,
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const c = new AntiAltClient({
  debug: true,
  altDays: 7, // optional,default 7
});

client.on("guildMemberAdd", (member) => {
  c.init(member, {
    action: "kick", // optional default kick
  });
});

c.on("altAction", (member, date, action) => {
  const embed = new Discord.MessageEmbed()
    .setTitle("Alt Found!")
    .setColor("RANDOM")
    .setFooter("Discord AntiAlts")
    .setTimestamp().setDescription(`
**__Alt Name__**: ${member.user} (${member.user.username})
**__ID__**: ${member.user.id}
**__Account Created__**: ${date.createdAt} days ago
**__Account Creation Date__**: ${date.createdAtDate}
**__Join Position__**: ${member.guild.memberCount}
**__Join Date__**: ${date.joinAt}
`);
  client.channels.cache.get("908281997170987038").send({ embeds: [embed] });
});

client.login(require("./config.json").token);
