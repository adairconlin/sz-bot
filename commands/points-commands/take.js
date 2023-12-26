const { SlashCommandBuilder } = require("discord.js");
const { getUser, takePoints } = require("../../utility");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('take')
		.setDescription('Take a certain amount of points for a user.')
        .addMentionableOption(option => option.setName("user").setDescription("Specify which users available points you want to take away."))
        .addIntegerOption(option => option.setName("points").setDescription("Enter the amount of available points you want to take away."))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const user = interaction.options.getMentionable('user').user;
        const int = interaction.options.getInteger("points");

        const userInfo = await getUser(user);
        const response = await takePoints(userInfo, int);

        if(response) {
            interaction.reply(response);
        }
	}
};