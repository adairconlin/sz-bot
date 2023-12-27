const { AutoPoints } = require("../schemas");

const setUpAutoPoints = async (points, channel, requirement) => {
    if(!points) {
        return "Please specify the amount of points to be rewarded in this channel.";
    } else if(points < 1) {
        return "Number of points cannot be lower than 1.";
    }
    
    if(!requirement) {
        requirement = null;
    }

    const checkForChannel = await AutoPoints.find({ channelId: channel });
    if(checkForChannel.length) {
        // Allow for overwritting the current config for specified channel
        await AutoPoints.findOneAndDelete({ channelId: channel });
    }

    return createAutoPointsChannel(points, channel, requirement);
}

const createAutoPointsChannel = async (points, channel, requirement) => {
    console.log("in createautopointschannel")
    const newChannel = {
        channelId: channel,
        repAmt: points,
        requirement: requirement,
    }

    let message; 
    await new AutoPoints(newChannel).save()
    .then(() => {
        let caseHandle = points > 1 ? "points" : "point";
        message = requirement != null ? `Channel is set to reward ${points} ${caseHandle} when a user posts an image!` : `Channel is set to reward ${points} ${caseHandle}`;
    })
    .catch(err => {
        console.log(err);
        message = "There was an issue with the data. Please let Sappy know so she can fix it. :-)";
    });

    return message;
}

module.exports = { setUpAutoPoints };