const { SlashCommandBuilder } = require("discord.js");
const { cloneCommandFilter } = require("../../database-controllers");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clone')
		.setDescription('Sets the current channel for the bot to clone to.'),
	async execute(interaction) {
        cloneCommandFilter("clone", interaction.channelId);

		await interaction.reply('Okay! Cloning to this channel. :-)');
	},
};