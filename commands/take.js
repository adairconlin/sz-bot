const { SlashCommandBuilder } = require("discord.js");
const { User } = require("../schemas");

const takeUserPoints = async (id, int) => {
    let value;
    if(!int || !id) {
        value = false;
        return value;
    }

    await User.updateOne({ discordId: id },
        {
            $inc: {
                pointsAmt: -int
            }
        }
    )
    .then(() => {value = true;})
    .catch(error => {value = false; console.log(error);});

    return value;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('take')
		.setDescription('Take a certain amount of points for a user.')
        .addMentionableOption(option => option.setName("mentionable").setDescription("Specify who's points you want to take away."))
        .addIntegerOption(option => option.setName("int").setDescription("Enter the amount of points you want to take away.")),
	async execute(interaction) {
        const mentionable = interaction.options.getMentionable('mentionable');
        const user = mentionable.user.id;
        const int = interaction.options.getInteger("int");

        const response = await takeUserPoints(user, int);

        if(response) {
            if(int > 1 || int === 0 ) {
                await interaction.reply(`<@${user}> has lost ${int} points!`);
            } else {
                await interaction.reply(`<@${user} has lost 1 point!`);
            }
        } else {
            await interaction.reply(`There was an error.`);
        }
	},
};