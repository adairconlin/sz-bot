const { SlashCommandBuilder } = require("discord.js");
const { getUser, givePoints } = require("../../utility");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give points to a user!')
        .addMentionableOption(option => option.setName("user").setDescription("Specify who you want to give points to. (required)"))
        .addIntegerOption(option => option.setName("points").setDescription("Specify the amount of points to give. (required)")),

	async execute(interaction) {
        const user = interaction.options.getMentionable('user').user;
        const int = interaction.options.getInteger("points");

        const userInfo = await getUser(user);
        const response = await givePoints(userInfo, int);

        if(response) {
            await interaction.reply(response);
        }
	}
};