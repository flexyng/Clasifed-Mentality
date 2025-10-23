const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Muestra la cola de música.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const queue = interaction.client.queue.get(guildId) || [];
        if (queue.length === 0) return interaction.reply({ content: '📭 Cola vacía.', ephemeral: true });

        const current = queue[0]?.title || 'Nada';
        const upcoming = queue.slice(1, 6).map((t, i) => `${i + 1}. ${t.title} (${t.duration})`).join('\n') || 'Ninguna más';

        const embed = new EmbedBuilder()
            .setTitle('🎵 Cola')
            .addFields(
                { name: 'Ahora', value: `**${current}**`, inline: false },
                { name: 'Próximas', value: upcoming, inline: false }
            )
            .setColor('#5865F2')
            .setFooter({ text: `Total: ${queue.length}` });

        await interaction.reply({ embeds: [embed] });
    },
};