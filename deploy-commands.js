const fs = require("node:fs");
const path = require("node:path");
const { Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
require("dotenv").config();

const commands = []
const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath)
    .filter(file => fs.statSync(path.join(commandsPath, file)).isDirectory());

for(const folder of commandFolders) {
    const folderPath = path.join(__dirname, "commands", folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"))
    commandFiles.forEach(file => {
        console.log(file);
        const filePath = path.join(__dirname, "commands", folder, file);
        const command = require(filePath);
        commands.push(command.data.toJSON())
    });
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
    .then(() => console.log("Successfully updated and registered commands!"))
    .catch(console.error);