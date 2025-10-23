const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Muestra información de un usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario (opcional, usa el tuyo por defecto)')
                .setRequired(false)),
    async execute(interaction) {
        const usuario = interaction.options.getUser('usuario') || interaction.user;
        const miembro = await interaction.guild.members.fetch(usuario.id);
        
        const embed = new EmbedBuilder()
            .setTitle(`Información de ${usuario.tag}`)
            .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'ID', value: `${usuario.id}`, inline: true },
                { name: 'Cuenta creada', value: `<t:${Math.floor(usuario.createdTimestamp / 1000)}:F>`, inline: true },
                { name: 'Unido al servidor', value: `<t:${Math.floor(miembro.joinedTimestamp / 1000)}:F>`, inline: true },
                { name: 'Roles', value: `${miembro.roles.cache.size > 1 ? miembro.roles.cache.map(r => r.name).join(', ') : 'Ninguno'}`, inline: false }
            )
            .setColor('#00ff00')
            .setFooter({ text: `Bot: ${interaction.client.user.tag}` });

        await interaction.reply({ embeds: [embed] });
    },
};