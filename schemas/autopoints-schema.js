const { Schema, model } = require("mongoose");

const AutoPointSchema = new Schema({
    channelId: {
        type: String
    },
    repAmt: {
        type: Number
    },
    requirement: {
        type: String
    }
});

const AutoPoints = model("AutoPoints", AutoPointSchema);

module.exports = AutoPoints;