const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { User } = require("../schemas");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('View the servers leaderboard!'),
	async execute(interaction, client) {
        let arr = [];
        let message = "";
        
        await User.find({})
            .sort({ pointsAmt : -1 })
            .then(users => {
                users.forEach(user => {
                    arr.push({
                        "name": user.username,
                        "points": user.pointsAmt
                    });
                });
            });

        for(let i = 0; i < arr.length; i++) {
            message += (`${i+1}. ${arr[i].name} - ${arr[i].points} pts \n`);
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("prevLeaderboard")
                .setLabel("Prev")
                .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                .setCustomId("nextLeaderboard")
                .setLabel("Next")
                .setStyle(ButtonStyle.Primary)
            );

        const embed = new EmbedBuilder()
                .setColor("DarkButNotBlack")
                .setTitle("Leaderboard")
                .setDescription(message);

        await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });

        // https://stackoverflow.com/questions/68553256/edit-an-embed-on-buttonclick-discord-js
        // await interaction.reply(message);
	},
};