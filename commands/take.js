const { SlashCommandBuilder } = require("discord.js");
const { User } = require("../schemas");

const takeUserPoints = async (id, int) => {
    let value;
    if(!int || !id) {
        value = "You must select both command options.";
        return value;
    }

    const findPoints = await User.findOne({ discordId: id });
    if(findPoints?.pointsAvail - int < 1) {
        value = "Users cannot have negative points.";
        return value;
    }

    await User.updateOne({ discordId: id },
        {
            $inc: {
                pointsAvail: -int
            }
        }
    )
    .then(() => {value = "success";})
    .catch(error => {value = "There was an error."; console.log(error);});

    return value;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('take')
		.setDescription('Take a certain amount of points for a user.')
        .addMentionableOption(option => option.setName("mentionable").setDescription("Specify who's points you want to take away."))
        .addIntegerOption(option => option.setName("int").setDescription("Enter the amount of points you want to take away."))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const mentionable = interaction.options.getMentionable('mentionable');
        const user = mentionable.user.id;
        const int = interaction.options.getInteger("int");

        const response = await takeUserPoints(user, int);

        if(response === "success") {
            if(int > 1 || int === 0 ) {
                await interaction.reply(`<@${user}> has lost ${int} points!`);
            } else {
                await interaction.reply(`<@${user}> has lost 1 point!`);
            }
        } else {
            await interaction.reply(`${response}`);
        }
	},
};