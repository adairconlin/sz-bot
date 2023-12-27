const { 
    checkIfScanChannel, 
    checkIfCloneChannel, 
    checkIfAutoPointChannel 
} = require("../utility");
require("dotenv").config();

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if(message.author.bot) return;

        //checking for necessary database events
        checkIfScanChannel(message);

        // checking for necessary clone events
        checkIfCloneChannel(message);

        //checking for necessary auto-point events
        checkIfAutoPointChannel(message);
    }
}