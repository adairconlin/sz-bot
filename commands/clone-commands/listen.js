const { SlashCommandBuilder } = require("discord.js");
const { cloneCommandFilter } = require("../../database-controllers");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listen')
		.setDescription('Sets the current channel for the bot to clone from.'),
	async execute(interaction) {
        cloneCommandFilter("listen", interaction.channelId);

		await interaction.reply('Okay! Listening to this channel. :-)');
	},
};