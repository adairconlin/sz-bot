const { Schema, model } = require("mongoose");

const ScanChannelSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    channels: {
        type: Array,
        "default": []
    }
    //eventual inventory ref
});

const ScanChannel = model("ScanChannel", ScanChannelSchema);

module.exports = ScanChannel;