const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Muestra el avatar de un usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario (opcional, usa el tuyo por defecto)')
                .setRequired(false)),
    async execute(interaction) {
        const usuario = interaction.options.getUser('usuario') || interaction.user;
        const avatarURL = usuario.displayAvatarURL({ dynamic: true, size: 4096 });

        const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${usuario.tag}`)
            .setImage(avatarURL)
            .setColor('#ff9900')
            .setFooter({ text: 'Haz clic en la imagen para verla en grande' });

        await interaction.reply({ embeds: [embed] });
    },
};