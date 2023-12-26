const { SlashCommandBuilder } = require("discord.js");
const { checkAutoPointsChannel } = require("../../db-controllers");

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

        const response = await checkAutoPointsChannel(int, channelId, requirement);
        
        let caseHandle;
        if(int > 1 || int === 0) {
            caseHandle = "points"
        } else {
            caseHandle = "point"
        };

        switch(typeof response) {
            case "string":
                await interaction.reply(response);
                break;
            case "boolean":
                if(response && requirement) {
                    await interaction.reply(`Channel is set to reward ${int} ${caseHandle} when a user posts an image!`);
                } else if(response && !requirement) {
                    await interaction.reply(`Channel is set to reward ${int} ${caseHandle}!`);
                }
                break;
            default:
                await interaction.reply("There was an error. Yell at sappy about it.");
        }
	},
};