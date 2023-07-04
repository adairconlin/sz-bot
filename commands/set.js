const { SlashCommandBuilder } = require("discord.js");
const { setUserPoints } = require("../utility");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Set a certain amount of points for a user.')
        .addMentionableOption(option => option.setName("user").setDescription("Specify which users leaderboard score you want to set. (required)"))
        .addIntegerOption(option => option.setName("points").setDescription("Enter the amount of points for this user. (required)")),

	async execute(interaction) {
        const userid = interaction.options.getMentionable('user').user.id;
        const int = interaction.options.getInteger("points");

        const response = await setUserPoints(userid, int);

        switch(typeof response) {
            case "string":
                await interaction.reply(response);
                break;
            case "boolean":
                if(response === true) {
                    if(int > 1 || int === 0 ) {
                        await interaction.reply(`<@${userid}> now has ${int} points!`);
                    } else {
                        await interaction.reply(`<@${userid}> now has 1 point!`);
                    }
                }
                break;
            default:
                await interaction.reply(`There was an error setting points. Please fix this, <@${process.env.SAPPY_ID}>.`);
        }
	},
};