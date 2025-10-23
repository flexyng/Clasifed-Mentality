const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce música de YouTube.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('URL o búsqueda')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply({ content: '🎵 Únete a un canal de voz primero.', ephemeral: true });

        const guildId = interaction.guild.id;
        let queue = interaction.client.queue.get(guildId) || [];
        let player = interaction.client.players.get(guildId);
        let connection;

        try {
            // Buscar track
            const search = await play.search(query, { limit: 1 });
            if (!search.length) return interaction.reply({ content: '❌ No encontré nada.', ephemeral: true });
            const track = { title: search[0].title, url: search[0].url, duration: search[0].durationRaw };

            // Conectar si no está
            connection = joinVoiceChannel({ channelId: voiceChannel.id, guildId, adapterCreator: interaction.guild.voiceAdapterCreator });
            if (connection.state.status !== VoiceConnectionStatus.Ready) {
                await new Promise((resolve) => connection.on(VoiceConnectionStatus.Ready, resolve));
            }

            // Crear player si no existe
            if (!player) {
                player = createAudioPlayer();
                interaction.client.players.set(guildId, player);
                player.on(AudioPlayerStatus.Idle, () => {
                    skipTrack(interaction.client, guildId);
                });
                connection.subscribe(player);
            }

            // Añadir a queue
            queue.push(track);
            interaction.client.queue.set(guildId, queue);

            const embed = new EmbedBuilder()
                .setTitle('🎵 Reproduciendo')
                .setDescription(`**${track.title}** (${track.duration})`)
                .setColor('#5865F2')
                .setFooter({ text: `En cola: ${queue.length - 1}` });

            if (queue.length === 1) {
                // Reproducir ahora
                const stream = await play.stream(track.url);
                const resource = createAudioResource(stream.stream, { inputType: stream.type });
                player.play(resource);
                embed.setThumbnail('https://img.icons8.com/fluency/48/000000/play.png'); // Icono simple
            } else {
                embed.setDescription(`**${track.title}** añadido a la cola (${track.duration})`);
                embed.setThumbnail('https://img.icons8.com/fluency/48/000000/add.png');
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Error al reproducir.', ephemeral: true });
        }
    },
};

// Función helper para skip (usada en idle)
async function skipTrack(client, guildId) {
    let queue = client.queue.get(guildId);
    if (!queue || queue.length === 0) return;
    queue.shift(); // Quitar actual
    client.queue.set(guildId, queue);
    if (queue.length > 0) {
        const track = queue[0];
        const stream = await play.stream(track.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });
        const player = client.players.get(guildId);
        player.play(resource);
    } else {
        client.queue.delete(guildId);
        setTimeout(() => client.players.delete(guildId), 5000); // Cleanup
    }
}