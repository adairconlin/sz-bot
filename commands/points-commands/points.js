const { SlashCommandBuilder } = require("discord.js");
const { getUser, getPoints } = require("../../utility");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('View a users available points. If no user is specified, view your own.')
        .addMentionableOption(option => option.setName("user").setDescription("Specify who's points you want to view. (optional)")),

	async execute(interaction) {
        const mentionable = interaction.options.getMentionable('user');
        let user;

        if(mentionable?.user) {
            user = mentionable.user; // user mentioned in the command
        } else {
            user = interaction.user; // user who sent the command
        }

        const userInfo = await getUser(user);
        const response = getPoints(userInfo);

        if(response) {
            await interaction.reply(response)
        } 
	}
};