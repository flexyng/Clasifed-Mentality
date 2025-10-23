const { SlashCommandBuilder } = require('discord.js');

const respuestas = [
    'Sí, definitivamente.',
    'No, lo siento.',
    'Tal vez.',
    '¡Por supuesto!',
    'No lo creo.',
    'Pregúntame después.',
    'Es probable.',
    'No es probable.',
    '¡Absolutamente!',
    'Mejor no.',
    '¡Claro que sí!',
    '¡Ni lo sueñes!',
    '¡Posiblemente!',
    '¡Imposible!',
    '¡Depende de ti!',
    '¡Sí, ve por ello!',
    '¡No, detente ahí!',
    '¡La respuesta es 42!', // Referencia a Hitchhiker's Guide
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Pregúntale a la bola 8 mágica.')
        .addStringOption(option =>
            option.setName('pregunta')
                .setDescription('Tu pregunta')
                .setRequired(true)),
    async execute(interaction) {
        const pregunta = interaction.options.getString('pregunta');
        const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];

        await interaction.reply(`🎱 **Pregunta:** ${pregunta}\n**Respuesta:** ${respuesta}`);
    },
};