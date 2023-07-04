const { checkForScanChannels, checkForCloneChannels, checkForAutoPointChannels } = require("../utility");
require("dotenv").config();

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if(message.author.bot) return;

        //checking for necessary database events
        checkForScanChannels(message);

        // checking for necessary clone events
        checkForCloneChannels(message);

        //checking for necessary auto-point events
        checkForAutoPointChannels(message);
    }
}