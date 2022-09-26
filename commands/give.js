const { SlashCommandBuilder } = require("discord.js");
const { giveUserPoints } = require("../utility");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give points to a user!')
        .addMentionableOption(option => option.setName("user").setDescription("Specify who you want to give points to. (required)"))
        .addIntegerOption(option => option.setName("points").setDescription("Specify the amount of points to give. (required)")),

	async execute(interaction) {
        const userid = interaction.options.getMentionable('user').user.id;
        const int = interaction.options.getInteger("points");

        const response = await giveUserPoints(userid, int);

        switch(typeof response) {
            case "string":
                await interaction.reply(response);
                break;
            case "boolean":
                if(response === true && int > 1) {
                    await interaction.reply(`<@${userid}> was rewarded ${int} points!`);
                } else if(response === true) {
                    await interaction.reply(`<@${userid}> was rewarded 1 point!`);
                }
                break;
            default:
                await interaction.reply("There was an error. Yell at sappy about it.");
        }
	},
};