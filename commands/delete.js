const { SlashCommandBuilder } = require("discord.js");
const { User } = require("../schemas");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete a user!')
        .addMentionableOption(option => option.setName("user").setDescription("Specify who you want to remove from the Lemon Art Database. (required)")),

	async execute(interaction) {
        const adminRole = process.env.ADMIN_ROLE_ID;
        const userRoles = interaction.member._roles;

        if(userRoles.indexOf(adminRole) < 0) {
            interaction.reply("You do not have permission to be deleting users.... >:(");
        } else {
            const user = interaction.options.getMentionable('user').user;
            const deleteUser = await User.deleteMany({ discordId: user.id });
    
            if(deleteUser.deletedCount > 0) {
                interaction.reply(`${user.username} has been removed from the Lemon Art Database.`);
            } else {
                interaction.reply(`${user.username} was not found in the Lemon Art Database.`);
            }
        }
	}
};