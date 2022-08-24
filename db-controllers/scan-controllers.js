const { ScanChannel } = require("../schemas");

//For checking and setting channels
const scanChannelCheck = async newId => {
    //await ScanChannel.deleteMany({});

    const result = await ScanChannel.find({ id: 1 });

    if(!result.length) {
        const newScan = {
            id: 1,
            channels: [newId]
        }

        await new ScanChannel(newScan).save();
    } else {
        checkForChannel(newId, result);
    }
}

const checkForChannel = async (newId, result) => {
    for(let i = 0; i < result[0]?.channels.length; i++) {
        if(result[0]?.channels[i] === newId) {
            return;
        }

        addScanChannel(newId);
    }
}

const addScanChannel = async newId => {
    await ScanChannel.updateOne({ id: 1 },
        {
            $push: {
                channels: newId
            }
        }
    )
}


module.exports = { scanChannelCheck }