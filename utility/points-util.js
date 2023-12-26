// Commands for interacting with points in the database
const { User } = require("../schemas");
const { addToDatabase } = require("./user-util");
let value;

const getUserPoints = user => {
    if(user != null && user.length > 0) {
        userPts = [ user[0]?.pointsAvail, user[0]?.pointsAmt ];
        return `<@${user[0].discordId}>\n\`Available Points: ${userPts[0]}\` \n\`Leaderboard Points: ${userPts[1]}\``;
    } else {
        return "There was an issue finding user data. Please let Sappy know so she can fix it. :-)"
    }
}

const setUserPoints = async (id, int) => {
    if(!int || !id) {
        return "Please define both fields for this command.";
    } else if(int < 0) {
        return "Please define a number of points higher than 0.";
    }

    const findUser = await User.find({ discordId: id });
    if(!findUser.length) {
        return "User not found."; //add to database
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

/*
* Return true upon successful update
* Return false upon failure to update specified user
* Return string of error message if missing a parameter or if
* there was an error adding a new user to database
*/
const giveUserPoints = async (interaction, user, int) => {
    if(!user || !int) {
        return "Please define both fields for this command.";
    } else if(int < 1) {
        return "Please define a number of points higher than 0.";
    }

    const findUser = addToDatabase(interaction, user, int);

    if(!findUser) {
        return "Error in finding or adding user to database. Yell a sappy."
    }

    await User.updateOne({ findUser },
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
        return "Please define a number of points higher than 0.";
    }

    const findUser = await User.find({ discordId: id });
    if(!findUser.length) {
        return "This user is not registered."; //add to database
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