// chan
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits} = require("discord.js");
require("dotenv").config();

const client = new Client({ 
    partials: [ "MESSAGE", "CHANNEL", "REACTION"],
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] 
});

//COMMAND PATHING
client.commands = new Collection;
const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath)
    .filter(file => fs.statSync(path.join(commandsPath, file)).isDirectory());

for(const folder of commandFolders) {
    const folderPath = path.join(__dirname, "commands", folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));
    commandFiles.forEach(file => {
        const filePath = path.join(__dirname, "commands", folder, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
    });
}

//EVENT PATHING
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on("interactionCreate", async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction);
    } catch(error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command",  ephemeral: true });
    }
});


client.login(process.env.TOKEN);