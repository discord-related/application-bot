const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
} = require("discord.js");
module.exports = {
  name: "application",
  async execute(interaction, client) {
    try {
      const { config } = client;
      const { acceptedRoles, requiredRoles, restrictedRoles } =
        config.Applications[interaction.values[0]];
      const Application = config.Applications[interaction.values[0]];
      const {
        guild,
        member: { roles },
        user,
      } = interaction;

      if (roles.cache.some((role) => acceptedRoles.includes(role.id))) {
        return interaction.reply({
          content: "You already have the accepted role(s).",
          ephemeral: true,
        });
      } else if (
        roles.cache.some((role) => restrictedRoles.includes(role.id))
      ) {
        return interaction.reply({
          content: "You're restricted from applying for this application.",
          ephemeral: true,
        });
      } else if (!roles.cache.some((role) => requiredRoles.includes(role.id))) {
        return interaction.reply({
          content: "You don't have the required role(s) to apply.",
          ephemeral: true,
        });
      }

      user.startApplication = Date.now();
      const Modal = new ModalBuilder()
        .setCustomId("applicationModal " + interaction.values[0])
        .setTitle(`${guild.name} | ${interaction.values[0]} `);
      Object.entries(Application.Questions).forEach(([key, value]) => {
        const TextInput = new TextInputBuilder()
          .setCustomId(key)
          .setLabel(key)
          .setMinLength(value.minLength)
          .setMaxLength(value.maxLength)
          .setStyle(value.type)
          .setRequired(value.required);
        if (value.placeholder) TextInput.setPlaceholder(value.placeholder);
        if (value.value) TextInput.setValue(value.value);
        Modal.setComponents(new ActionRowBuilder().setComponents(TextInput));
      });
      interaction.showModal(Modal);
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "An error occurred, please try again later.",
        ephemeral: true,
      });
    }
  },
};