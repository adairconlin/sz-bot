const { SlashCommandBuilder } = require("discord.js");
const { setUpAutoPoints } = require("../../database-controllers");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setautopoints')
		.setDescription('Set this channel for automatic point rewards.')
        .addIntegerOption(option => option.setName("points")
                .setDescription("Enter the amount of points to be automatically rewarded in this channel. (required)"))
        .addStringOption(option => option.setName("requirement")
                .setDescription("Require a user to post an image for points to be rewarded. (optional)")
                .addChoices({ name: "Require image posted.", value: "image"})),

	async execute(interaction) {
        const channelId = interaction.channelId;
        const int = interaction.options.getInteger("points");
        const requirement = interaction.options.getString("requirement");

        const response = await setUpAutoPoints(int, channelId, requirement);

        if(response) {
            await interaction.reply(response);
        }
	},
};