const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Reanuda la música.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const player = interaction.client.players.get(guildId);
        if (!player || player.state.status !== 'paused') return interaction.reply({ content: '❌ No está pausado.', ephemeral: true });

        player.unpause();
        const embed = new EmbedBuilder()
            .setTitle('▶️ Reanudado')
            .setDescription('La música continúa.')
            .setColor('#5865F2')
            .setThumbnail('https://img.icons8.com/fluency/48/000000/play.png');

        await interaction.reply({ embeds: [embed] });
    },
};