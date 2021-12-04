const { Client, MessageAttachment } = require("discord.js");
const x = require("xfinity");
const fs = require("fs").promises;
const client = new Client({
  intents: 32767,
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
const { Database } = require("quickmongo");
const config = require("./config.json");
const db = new Database(config.mongoose);

client.on("ready", () => {
  console.log("Ready");
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "DM" && !message.guild) return;

  if (message.content.startsWith(`${config.prefix}set-channel`)) {
    const channel = message.mentions.channels.first();
    if (!channel) {
      message.reply("Please specify a channel to send logs to.");
    } else {
      db.set(`verify_${message.guild.id}`, channel.id);
      message.channel.send(`${channel} has been setupped as logs channel.`);
    }
  }
  if (message.content.startsWith(`${config.prefix}set-role`)) {
    const channel = message.mentions.roles.first();
    if (!channel) {
      message.reply("Please specify a role to send logs to.");
    } else {
      db.set(`role_${message.guild.id}`, channel.id);
      message.channel.send(`${channel} has been setupped as verify role.`);
    }
  }
  if (message.content === "emit") {
    client.emit("guildMemberAdd", message.member);
  }
});
client.login(config.token);

client.on("guildMemberAdd", async (member) => {
  //   console.log(member);
  const data = await db.get(`verify_${member.guild.id}`);
  if (data) {
    const channel = client.channels.cache.get(data);
    const role = member.guild.roles.cache.get(
      await db.get(`role_${member.guild.id}`)
    );
    const captcha = await x.createCaptcha();
    const file = new MessageAttachment(
      `${__dirname}/captchas/${captcha}.png`,
      `${captcha}.png`
    );
    // console.log(role);
    try {
      const msg = await member.send({
        files: [file],
        content: "You have 60 seconds to solve the captcha",
      });
      try {
        const filter = (m) => {
          if (m.author.bot) return;
          if (m.author.id === member.id && m.content === captcha) return true;
          else {
            m.channel.send("You entered the captcha incorrectly.");
            return false;
          }
        };
        const response = await msg.channel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"],
        });
        if (response) {
          await msg.channel.send("You have verified yourself!");
          if (role) {
            await member.roles.add(role.id);
          } else {
            msg.channel.send(
              "Coudnlt find the verfied role. Please setup the server again."
            );
          }
          await channel.send(
            `${member.user.tag} has successfully verfied themselves.`
          );
          await fs
            .unlink(`${__dirname}/captchas/${captcha}.png`)
            .catch((err) => console.log(err));
        }
      } catch (err) {
        console.log(err);
        await msg.channel.send(
          "You did not solve the captcha correctly on time."
        );
        await member.kick().catch((e) => console.log(e));
        await channel.send(`${member.user.tag} failed to solve captcha.`);
        await fs
          .unlink(`${__dirname}/captchas/${captcha}.png`)
          .catch((err) => console.log(err));
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Np data found.");
  }
});
