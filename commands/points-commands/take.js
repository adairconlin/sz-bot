const { SlashCommandBuilder } = require("discord.js");
const { takeUserPoints } = require("../../utility");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('take')
		.setDescription('Take a certain amount of points for a user.')
        .addMentionableOption(option => option.setName("user").setDescription("Specify which users available points you want to take away."))
        .addIntegerOption(option => option.setName("points").setDescription("Enter the amount of available points you want to take away."))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const userid = interaction.options.getMentionable('user').user.id;
        const int = interaction.options.getInteger("points");

        const response = await takeUserPoints(userid, int);

        switch(typeof response) {
            case "string":
                await interaction.reply(response);
                break;
            case "boolean":
                if(response === true) {
                    if(int > 1 || int === 0 ) {
                        await interaction.reply(`<@${userid}> has lost ${int} points!`);
                    } else {
                        await interaction.reply(`<@${userid}> has lost 1 point!`);
                    }
                }
                break;
            default:
                await interaction.reply("There was an error. Yell at sappy about it");
                break;
        }
	}
};