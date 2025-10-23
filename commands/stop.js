const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Detiene la música y limpia la cola.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const player = interaction.client.players.get(guildId);
        if (!player) return interaction.reply({ content: '❌ Nada reproduciendo.', ephemeral: true });

        player.stop();
        interaction.client.queue.delete(guildId);
        interaction.client.players.delete(guildId);

        const embed = new EmbedBuilder()
            .setTitle('⏹️ Detenido')
            .setDescription('Música parada. Cola limpiada.')
            .setColor('#5865F2')
            .setThumbnail('https://img.icons8.com/fluency/48/000000/stop.png');

        await interaction.reply({ embeds: [embed] });
    },
};