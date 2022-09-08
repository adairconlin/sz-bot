const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String
    },
    discordId: {
        type: String,
        required: true
    },
    pointsAmt: {
        type: Number
    },
    pointsAvail: {
        type: Number
    }
    //eventual inventory ref
});

const User = model("User", UserSchema);

module.exports = User;