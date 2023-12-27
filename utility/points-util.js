// Commands for interacting with points in the database
const { User } = require("../schemas");
let value;
let errorResponse = "There was an issue finding user data. Please let Sappy know so she can fix it. :-)";

// Used by points.js
const getPoints = user => {
    if(user != null && user.length > 0) {
        userPts = [ user[0]?.pointsAvail, user[0]?.pointsAmt ];
        return `<@${user[0].discordId}>\n\`Available Points: ${userPts[0]}\` \n\`Leaderboard Points: ${userPts[1]}\``;
    } else {
        return errorResponse;
    }
}

// Used by set.js
const setPoints = async (user, int) => {
    let response;
    if(!int) {
        return "Please define the point field for this command.";
    } else if(int < 0) {
        return "Please define a number of points higher than 0. >:-(";
    } else if(user == null || user.length < 1) {
        return errorResponse;
    }

    await User.updateOne({ discordId: user[0].discordId },
        {  
            pointsAmt: int 
        })
        .then(() => {
            userPts = [ user[0]?.pointsAvail, int ];
            response = `<@${user[0].discordId}> now has ${int} points!\n\`Available Points: ${userPts[0]}\` \n\`Leaderboard Points: ${userPts[1]}\``;
        })
        .catch(err => { 
            console.log(err); 
            response = errorResponse; 
        });

    return response;
}

// Used by give.js
// Used by checkForAutoPointChannels in channel-event-util.js
const givePoints = async (user, int) => {
    let response;
    if(!int) {
        return "Please define the point field for this command.";
    } else if(int < 0) {
        return "Please define a number of points higher than 0. >:-(";
    } else if(user == null || user.length < 1) {
        return errorResponse;
    }

    await User.updateOne({ discordId: user[0].discordId },
        {
            $inc: {
                pointsAmt: int,
                pointsAvail: int
            }
        })
        .then(() => {
            userPts = [ user[0]?.pointsAvail + int, user[0]?.pointsAmt + int ];
            pluralCheck = int > 1 ? "points" : "point"
            response = `<@${user[0].discordId}> was rewarded ${int} ${pluralCheck}!\n\`Available Points: ${userPts[0]}\` \n\`Leaderboard Points: ${userPts[1]}\``;
        })
        .catch(err => { 
            console.log(err); 
            response = errorResponse;  
        });

    return response;
}

// Used by take.js
const takePoints = async (user, int) => {
    let response;
    if(!int) {
        return "Please define the point field for this command.";
    } else if(int < 0) {
        return "Please define a number of points higher than 0. >:-(";
    } else if(user == null || user.length < 1) {
        return errorResponse;
    }

    if(user[0]?.pointsAvail - int < 0) {
        return "Users cannot have negative points.";
    }

    await User.updateOne({ discordId: user[0].discordId },
        {
            $inc: {
                pointsAvail: -int
            }
        }
    )
        .then(() =>  {
            userPts = [ user[0]?.pointsAvail - int, user[0]?.pointsAmt - int ];
            pluralCheck = int > 1 ? "points" : "point";
            response = `<@${user[0].discordId}> lost ${int} ${pluralCheck}...\n\`Available Points: ${userPts[0]}\` \n\`Leaderboard Points: ${userPts[1]}\``
        })
        .catch(err => { 
            console.log(err); 
            response = errorResponse; 
        });
    
    return response;
    
}

module.exports = { getPoints, setPoints, givePoints, takePoints };