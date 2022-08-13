const { Schema, model } = require("mongoose");

const CloneSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    // /listen
    cloneFromChannelId: {
        type: String
    },
    // /clone
    cloneToChannelId: {
        type: String
    }
});

const Clone = model("Clone", CloneSchema);

module.exports = Clone;