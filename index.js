// index.js - Actualizado con sistema de música

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const play = require('play-dl'); 


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        
        GatewayIntentBits.GuildVoiceStates,
    ],
});


client.commands = new Collection();


client.queue = new Map();
client.players = new Map();


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`Comando cargado: ${command.data.name}`);
    } else {
        console.log(`[ADVERTENCIA] El comando en ${filePath} no tiene un nombre o función 'execute'.`);
    }
}


client.once('ready', () => {
    console.log(`¡El bot ${client.user.tag} está en línea!`);
    console.log(`Comandos cargados: ${client.commands.size}`);
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Error al ejecutar.', ephemeral: true });
        }
    }
});


client.on('voiceStateUpdate', (oldState, newState) => {
    const guildId = oldState.guild.id;
    if (oldState.channelId && !newState.channelId && oldState.channel.members.size === 1) { 
        setTimeout(() => {
            const connection = joinVoiceChannel({ channelId: oldState.channelId, guildId, adapterCreator: oldState.guild.voiceAdapterCreator });
            if (connection.state.status === VoiceConnectionStatus.Disconnected) {
                client.queue.delete(guildId);
                client.players.delete(guildId);
            }
        }, 5000);
    }
});


client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (message.content.startsWith('!ping')) {
        message.reply('¡Pong!');
    }
});

process.on('unhandledRejection', error => {
    console.error('Error no manejado:', error);
});

client.login('TU_TOKEN_AQUI');