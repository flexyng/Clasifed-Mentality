// index.js - Archivo principal para tu bot de Discord con discord.js v14

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers,   
    ],
});


client.commands = new Collection();


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

    if (!command) {
        console.error(`No se encontró el comando ${interaction.commandName}.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const { reply } = interaction;
        if (reply) {
            await interaction.reply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
        }
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