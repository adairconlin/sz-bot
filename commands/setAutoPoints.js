const { SlashCommandBuilder } = require("discord.js");
const { AutoPoints } = require("../schemas");

const setAutoPointsChannel = async (int, id, rq) => {
    let value;
    if(!int) {
        value = false;
        return value;
    }

    if(!rq) {
        rq = null;
    }

    const newChannel = {
        channelId: id,
        repAmt: int,
        requirement: rq,
    }

    // add new schema that stores auto point channels
    await new AutoPoints(newChannel)
        .then(() => {value = true;})
        .catch(error => {value = false; console.log(error);});

    return value;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setautopoints')
		.setDescription('Set this channel for automatic point rewards.')
        .addIntegerOption(option => option.setName("int").setDescription("Enter the amount of points to be automatically rewarded."))
        .addStringOption(option =>
            option.setName("requirement")
                .setDescription("Require image for points to be rewarded")
                .addChoices({ name: "Require image posted.", value: "image"}))
        .setDefaultMemberPermissions(0),
	async execute(interaction) {
        const channelId = interaction.channelId;
        const int = interaction.options.getInteger("int");
        const requirement = interaction.options.getString("requirement");

        const response = await setAutoPointsChannel(int, channelId, requirement);

        if(response) {
            let caseHandle;
            if(int > 1 || int === 0) {
                caseHandle = "points"
            } else {
                caseHandle = "point"
            };

            if(requirement) {
                await interaction.reply(`Channel is set to reward ${int} ${caseHandle} when a user posts an image!`);
            } else {
                await interaction.reply(`<Channel is set to reward ${int} ${caseHandle}!`);
            }
        } else {
            await interaction.reply(`There was an error.`);
        }
	},
};