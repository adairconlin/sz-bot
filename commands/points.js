const { SlashCommandBuilder } = require("discord.js");
const { getUserPoints } = require("../utility");
const { User } = require("../schemas");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('View a users available points. If no user is specified, view your own.')
        .addMentionableOption(option => option.setName("user").setDescription("Specify who's points you want to view. (optional)")),

	async execute(interaction) {
        const mentionable = interaction.options.getMentionable('user');
        let userid;

        // const userFind = await User.deleteMany({ discordId: "314766060010078209" });
        // console.log(userFind);

        if(mentionable?.user) {
            userid = mentionable.user.id;
        } else {
            userid = interaction.user.id;
        }

        const response = await getUserPoints(userid);

        switch(typeof response) {
            case "string":
                await interaction.reply(response);
                break;
            case "object":
                await interaction.reply(`<@${userid}>\n\`Available Points: ${response[0]}\` \n\`Leaderboard Points: ${response[1]}\``);
                break;
            default:
                await interaction.reply("There was an error. Yell at sappy about it.");
                break;
        }
	},
};