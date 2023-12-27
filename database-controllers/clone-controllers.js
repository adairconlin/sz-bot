const { Clone } = require("../schemas");
require("dotenv").config();

const cloneCommandFilter = async (cmd, channelId) => {
    // look for existing schema
    const result = await Clone.find({ id: process.env.ENV_ID });

    // if there is no schema: create one, then call the next function
    if(!result.length) {
        const newChannels = {
            id: process.env.ENV_ID
        }
        await new Clone(newChannels).save().then(() => { checkCommand(cmd, channelId) });
    } else {
        checkCommand(cmd, channelId);
    }
}

const checkCommand = (cmd, id) => {
    if(cmd === "listen") {
        updateListeningChannel(id);
    } else if(cmd === "clone") {
        updateClonedChannel(id);
    }
}

const updateListeningChannel = async (channelId) => {
    await Clone.findOneAndUpdate({ id: process.env.ENV_ID }, { cloneFromChannelId: channelId }, { new: true });
}


const updateClonedChannel = async (id) => {
    await Clone.findOneAndUpdate({ id: process.env.ENV_ID }, { cloneToChannelId: id });
}

module.exports = { cloneCommandFilter };