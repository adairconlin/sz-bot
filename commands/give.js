const { SlashCommandBuilder } = require("discord.js");
const { User } = require("../schemas");

const giveUserPoints = async (id, int) => {
    let value;

    await User.updateOne({ discordId: id },
        {
            $inc: {
                pointsAmt: int,
                pointsAvail: int
            }
        }
    )
    .then(() => {value = true;})
    .catch(error => {value = false; console.log(error);});

    return value;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give points to a user!')
        .addMentionableOption(option => option.setName("mentionable").setDescription("Specify who you want to give points to."))
        .addIntegerOption(option => option.setName("int").setDescription("Enter the amount of points to give."))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const mentionable = interaction.options.getMentionable('mentionable');
        const user = mentionable.user.id;
        const int = interaction.options.getInteger("int");

        const response = await giveUserPoints(user, int);

        if(response) {
            if(int > 1 ) {
                await interaction.reply(`<@${user}> was rewarded ${int} points!`);
            } else {
                await interaction.reply(`<@${user}> was rewarded 1 point!`);
            }
        } else {
            await interaction.reply(`<@${user}> does not exist.`);
        }
	},
};