const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { User } = require("../schemas");
const Pagination = require("customizable-discordjs-pagination");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('View the servers leaderboard!'),
	async execute(interaction, client) {
        let arr = [];
        let pages  = [];
        let message = "";

        const buttons = [
            { label: "Previous", style: ButtonStyle.Primary },
            { label: "Next", style: ButtonStyle.Primary }
        ];
        
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

        for(let i = 0; i < 20; i++) {
            message += (`${i+1}. ${arr[i].name} - ${arr[i].points} pts \n`);
        }

        let embed1 = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setTitle("Leaderboard")
            .setDescription(message);
        pages.push(embed1);
        
        let count = 21;
        let embedCount = 2;
        message = "";
        while(count < arr.length) {
            if(count % 20 > 0) {
                message += `${count}. ${arr[count].name} - ${arr[count].points} pts \n`;
            } else {
                message += `${count}. ${arr[count].name} - ${arr[count].points} pts`;

                let name = eval("let embed" + embedCount);
                name = new EmbedBuilder()
                    .setColor("DarkButNotBlack")
                    .setTitle("Leaderboard")
                    .setDescription(message);
                pages.push(name);
                embedCount++;
                message = "";
            }

            count++
        }

        new Pagination()
            .setCommand(interaction)
            .setPages(pages)
            .setButtons(buttons)
            .setPaginationCollector({ timeout: 120000 })
            .setFooter({ enable: true })
            .send();
        // https://stackoverflow.com/questions/68553256/edit-an-embed-on-buttonclick-discord-js
        // await interaction.reply(message);
	},
};

// create a page for the first 10 messages,
// anything over a multiple of 10, create another page