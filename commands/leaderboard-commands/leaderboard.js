const { SlashCommandBuilder,  ButtonStyle, EmbedBuilder } = require("discord.js");
const { User } = require("../../schemas");
const Pagination = require("customizable-discordjs-pagination");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('View the servers leaderboard!'),
	async execute(interaction) {
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
            .setColor("Yellow")
            .setTitle("Lemon Art Leaderboard")
            .setDescription(message)
            .addFields({ name: "━━━━━", value: "*Your leaderboard score is different from your available points.*" });
        pages.push(embed1);
        
        let count = 21;
        let embedCount = 2;
        message = "";

        while(count < arr.length) {
            if(count === arr.length - 1) {
                message += `${count}. ${arr[count-1].name} - ${arr[count-1].points} pts\n`;
                message += `${count+1}. ${arr[count].name} - ${arr[count].points} pts`;

                let name = eval("let embed" + (embedCount+1));
                name = new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle("Lemon Art Leaderboard")
                    .setDescription(message)
                    .addFields({ name: "━━━━━", value: "Your leaderboard score is different from your available points."});
                pages.push(name);
                embedCount++;
                message = "";
            } else if(count % 20 > 0) {
                message += `${count}. ${arr[count-1].name} - ${arr[count-1].points} pts \n`;
            } else {
                message += `${count}. ${arr[count-1].name} - ${arr[count-1].points} pts`;

                let name = eval("let embed" + embedCount);
                name = new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle("Lemon Art Leaderboard")
                    .setDescription(message)
                    .addFields({ name: "━━━━━", value: "Your leaderboard score is different from your available points."} );
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
	},
};

// create a page for the first 10 messages,
// anything over a multiple of 10, create another page
// for the last name, create an embed with the current message