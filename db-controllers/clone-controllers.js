const { Clone } = require("../schemas");

const cloneCommandFilter = async (cmd, channelId) => {
    // look for existing schema
    const result = await Clone.find({ id: 1 });

    // if there is no schema, create one
    // then call the next function
    if(!result.length) {
        const newChannels = {
            id: 1
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
    await Clone.findOneAndUpdate({ id: 1 }, { cloneFromChannelId: channelId }, { new: true });
}


const updateClonedChannel = async (id) => {
    await Clone.findOneAndUpdate({ id: 1 }, { cloneToChannelId: id });
}

module.exports = { cloneCommandFilter };