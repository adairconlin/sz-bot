const { SlashCommandBuilder } = require("discord.js");
const { getUser, setUserPoints } = require("../../utility");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Set a certain amount of points for a user.')
        .addMentionableOption(option => option.setName("user").setDescription("Specify which users leaderboard score you want to set. (required)"))
        .addIntegerOption(option => option.setName("points").setDescription("Enter the amount of points for this user. (required)")),

	async execute(interaction) {
        const user = interaction.options.getMentionable('user').user;
        const int = interaction.options.getInteger("points");

        const userInfo = await getUser(user);
        const response = await setUserPoints(userInfo, int);

        if(response) {
            await interaction.reply(response)
        } 
	},
};