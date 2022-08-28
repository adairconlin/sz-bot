const { SlashCommandBuilder } = require("discord.js");
const { User } = require("../schemas");

const setUserPoints = async (id, int) => {
    let value;
    if(!int || !id) {
        value = false;
        return value;
    }

    await User.updateOne({ discordId: id },
        {
            pointsAmt: int
        }
    )
    .then(() => {value = true;})
    .catch(error => {value = false; console.log(error);});

    return value;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Set a certain amount of points for a user.')
        .addMentionableOption(option => option.setName("mentionable").setDescription("Specify who's points you want to set."))
        .addIntegerOption(option => option.setName("int").setDescription("Enter the amount of points for this user.")),
	async execute(interaction) {
        const mentionable = interaction.options.getMentionable('mentionable');
        const user = mentionable.user.id;
        const int = interaction.options.getInteger("int");

        const response = await setUserPoints(user, int);

        if(response) {
            if(int > 1 || int === 0 ) {
                await interaction.reply(`<@${user}> now has ${int} points!`);
            } else {
                await interaction.reply(`<@${user}> now has 1 point!`);
            }
        } else {
            await interaction.reply(`There was an error.`);
        }
	},
};