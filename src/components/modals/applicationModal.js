const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle: { Danger, Success },
  EmbedBuilder,
} = require("discord.js");
const { formatMilliseconds } = require("format-ms");

module.exports = {
  id: "applicationModal",
  async execute(interaction, client) {
    try {
      const { fields, guild, member, user } = interaction;
      const { config } = client;
      const Application = config.Applications[interaction.customId.replace("applicationModal ", "")];
      const { pendingColor } = config;
      const { Channel, mentionRoles } = Application;

      let mentions = "";
      mentionRoles.forEach((role) => {
        mentions += `<@&${role}> `;
      });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL({ size: 512 }),
        })
        .setTitle(`**${user.tag}'s Application**`)
        .setColor(pendingColor)
        .setThumbnail(user.displayAvatarURL({ size: 512 }))
        .setFooter({
          text: `${interaction.customId.replace("applicationModal ", "")} | Application`,
          iconURL: guild.iconURL({ size: 512 }),
        })
        .setTimestamp()

      Object.keys(Application.Questions).forEach((key) => {
        let question = fields.getTextInputValue(key);
        if (question.length < 1) question = "No answer provided";
        embed.addFields({ name: key, value: question });
      });

      embed.addFields({
        name: "Application Statistics",
        value: [
          `> 📋 **Application Duration**: \`${formatMilliseconds(
            Date.now() - user.startApplication,
            { ignore: ["millisecond"] }
          )}\``,
          `> 🧑 **User**: ${user}`,
          `> 💳 **User ID**: \`${user.id}\``,
          `> 🤝 **Member Since**: <t:${parseInt(
            member.joinedTimestamp / 1000
          )}:R>`,
          `> 📅 **Account Created**: <t:${parseInt(
            user.createdTimestamp / 1000
          )}:R>`,
        ].join("\n"),
      });

      await guild.channels.cache
        .get(Channel)
        .send({
          content: mentions,
          embeds: [embed],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setCustomId("accept")
                .setLabel("Accept")
                .setStyle(Success),
              new ButtonBuilder()
                .setCustomId("deny")
                .setLabel("Deny")
                .setStyle(Danger),
              new ButtonBuilder()
                .setCustomId("denyWithReason")
                .setLabel("Deny With Reason")
                .setStyle(Danger)
            ),
          ],
        })
        .then(async (msg) => {
          msg.startThread({
            name: `${user.tag}'s Application`,
            autoArchiveDuration: 1440,
            reason: `${user.tag}'s Application`,
          });

          interaction.reply({
            content:
              "Thank you for submitting your application! We'll get back to you as soon as possible.",
            ephemeral: true,
          });
        });
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "An error occurred, please try again later.",
        ephemeral: true,
      });
    }
  },
};