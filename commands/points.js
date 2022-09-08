const { SlashCommandBuilder } = require("discord.js");
const { User } = require("../schemas");

const getUserPoints = async id => {
    const findUser = await User.find({ discordId: id });
    
    if(!findUser.length) {
        return "This user is not registered.";
    }

    return findUser[0]?.pointsAvail;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('View user points. If no user specified, view your own.')
        .addMentionableOption(option => option.setName("mentionable").setDescription("Specify who's points you want to view.")),
	async execute(interaction) {
        const mentionable = interaction.options.getMentionable('mentionable');
        let user;

        if(mentionable?.user) {
            user = mentionable.user;
        } else {
            user = interaction.user;
        }

        const points = await getUserPoints(user.id);

        if(points > 1) {
            await interaction.reply(`<@${user.id}> has ${points} points!`);
        } else if(points === 1) {
            await interaction.reply(`<@${user.id}> has ${points} point. D:`);
        } else {
            await interaction.reply(`<@${user.id}> has no points...`);
        }
	},
};