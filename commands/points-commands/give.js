const { SlashCommandBuilder } = require("discord.js");
const { giveUserPoints } = require("../../utility");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give points to a user!')
        .addMentionableOption(option => option.setName("user").setDescription("Specify who you want to give points to. (required)"))
        .addIntegerOption(option => option.setName("points").setDescription("Specify the amount of points to give. (required)")),

	async execute(interaction) {
        const user = interaction.options.getMentionable('user').user;
        const int = interaction.options.getInteger("points");

        const response = await giveUserPoints(interaction, user, int);

        switch(typeof response) {
            case "string": //error scenario
                await interaction.reply(response);
                break;
            case "boolean":
                if(response === true && int > 1) {
                    await interaction.reply(`<@${user.id}> was rewarded ${int} points!`);
                } else if(response === true) {
                    await interaction.reply(`<@${user.id}> was rewarded 1 point!`);
                }
                break;
            default:
                await interaction.reply(`There was an error giving <@${user.id}> points. Yell at sappy about it.`);
        }
	}
};