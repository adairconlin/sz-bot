const { Schema, model } = require("mongoose");

const ScanChannelSchema = new Schema({
    channelIds: {[

    ]}
    //eventual inventory ref
});

const ScanChannel = model("ScanChannel", ScanChannelSchema);

module.exports = ScanChannel;