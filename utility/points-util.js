// Commands for interacting with points in the database
const { User } = require("../schemas");
let value;

const getUserPoints = async id => {
    const findUser = await User.find({ discordId: id });
    if(!findUser.length) {
        return "This user is not registered.";
    }

    let arr = [findUser[0]?.pointsAvail, findUser[0]?.pointsAmt];

    return arr;
}

const setUserPoints = async (id, int) => {
    if(!int || !id) {
        return "Please define both fields for this command.";
    } else if(int < 0) {
        return "Please define a number of points higher than 0";
    }
    const findUser = await User.find({ discordId: id });
    if(!findUser.length) {
        return "This user is not registered.";
    }

    await User.updateOne({ discordId: id },
        { 
            pointsAmt: int 
        }
    )
        .then(() => { value = true; })
        .catch(err => { console.log(err); value = false;  });

    return value;
}

const giveUserPoints = async (id, int) => {
    if(!id || !int) {
        return "Please define both fields for this command.";
    } else if(int < 1) {
        return "Please define a number of points higher than 0";
    }

    const findUser = await User.find({ discordId: id });
    if(!findUser.length) {
        return "This user is not registered.";
    }

    await User.updateOne({ discordId: id },
        {
            $inc: {
                pointsAmt: int,
                pointsAvail: int
            }
        }
    )
        .then(() => { value = true; })
        .catch(err => { console.log(err); value = false; });

    return value;
}

const takeUserPoints = async (id, int) => {
    if(!id || !int) {
        return "Please define both fields for this command.";
    } else if(int < 1) {
        return "Please define a number of points higher than 0";
    }

    console.log(id);
    const findUser = await User.find({ discordId: id });
    console.log(findUser.length);
    if(!findUser.length) {
        return "This user is not registered.";
    }

    if(findUser?.pointsAvail - int < 0) {
        return "Users cannot have negative points.";
    }

    await User.updateOne({ discordId: id },
        {
            $inc: {
                pointsAvail: -int
            }
        }
    )
        .then(() => { value = true })
        .catch(err => { console.log(err); value = false; });
    
    return value;
}

module.exports = { getUserPoints, setUserPoints, giveUserPoints, takeUserPoints };