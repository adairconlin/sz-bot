const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String
    },
    discordId: {
        type: String
    },
    diamondAmt: {
        type: String
    }
    //eventual inventory ref
});

const User = model("User", UserSchema);

module.exports = User;