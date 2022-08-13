const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const { Clone } = require("./schemas");
const { Client, Collection, GatewayIntentBits} = require("discord.js");
require("dotenv").config();

const client = new Client({ 
    partials: [ "MESSAGE", "CHANNEL", "REACTION"],
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] 
});

// COMMAND PATHING
client.commands = new Collection;
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
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


const clone = msg => {
    //const getCloneChannelId = await Clone.find({ id: 1 });
    const userInfo = msg.author.username;

    if(msg.attachments.size > 0) {
        for(let i = 0; i < msg.attachments.size; i++) {
            const imgArr = [];
            msg.attachments.forEach(el => imgArr.push(el.url));
            if(i == 0) {
                const testEmbed = new MessageEmbed()
                    .setColor("DARK_GOLD")
                    .setTitle(userInfo)
                    .setImage(imgArr[0])
                    .setDescription(msg.content)
                    .setTimestamp();
                                        
                client.channels.cache.get(bufferCloneId).send({ embeds: [testEmbed] });
            } else {
                const testEmbed = new MessageEmbed()
                    .setColor("DARK_GOLD")
                    .setTitle(userInfo)
                    .setImage(imgArr[i])
                    .setTimestamp();

                client.channels.cache.get(bufferCloneId).send({ embeds: [testEmbed] });
            }
        }
    } else {
        const testEmbed = new MessageEmbed()
            .setColor("DARK_GOLD")
            .setTitle(userInfo)
            .setDescription(msg.content)
            .setTimestamp();

        client.channels.cache.get(bufferCloneId).send({ embeds: [testEmbed] });
    }
}

client.login(process.env.TOKEN);