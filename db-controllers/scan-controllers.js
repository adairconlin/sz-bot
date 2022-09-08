const { ScanChannel } = require("../schemas");
require("dotenv").config();

//For checking and setting channels
const scanChannelCheck = async newId => {
    //await ScanChannel.deleteMany({});

    const result = await ScanChannel.find({ id: process.env.ENV_ID });
    console.log("/scan result: " + result);

    if(!result.length) {
        const newScan = {
            id: process.env.ENV_ID,
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
    await ScanChannel.updateOne({ id: process.env.ENV_ID },
        {
            $push: {
                channels: newId
            }
        }
    )
}


module.exports = { scanChannelCheck }