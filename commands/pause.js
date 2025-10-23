const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa la música.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const player = interaction.client.players.get(guildId);
        if (!player || player.state.status === 'idle') return interaction.reply({ content: '❌ Nada reproduciendo.', ephemeral: true });

        player.pause();
        const embed = new EmbedBuilder()
            .setTitle('⏸️ Pausado')
            .setDescription('La música está en pausa.')
            .setColor('#5865F2')
            .setThumbnail('https://img.icons8.com/fluency/48/000000/pause.png');

        await interaction.reply({ embeds: [embed] });
    },
};