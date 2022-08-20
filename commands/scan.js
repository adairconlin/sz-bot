const { SlashCommandBuilder } = require("discord.js");
const { scanChannelCheck } = require("../db-controllers");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scan')
		.setDescription('Adds channel to the list of those who are scanned for new users.')
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        let result = scanChannelCheck(interaction.channelId);

		await interaction.reply("Okay! Scanning this channel for new users :-)");
	},
};