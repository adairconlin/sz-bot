const { checkForScanChannels, checkForCloneChannels } = require("../utility");
require("dotenv").config();

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if(message.author.bot) return;

        //checking for necessary database events
        checkForScanChannels(message);

        // checking for necessary clone events
        checkForCloneChannels(message);
    }
}