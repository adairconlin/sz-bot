const { AutoPoints } = require("../schemas");

const checkAutoPointsChannel = async (int, id, rq) => {
    if(!int) {
        return "Please specify the amount of points to be rewarded in this channel.";
    } else if(int < 1) {
        return "Number of points cannot be lower than 1.";
    }
    
    if(!rq) {
        rq = null;
    }

    const checkForChannel = AutoPoints.find({ channelId: id });
    if(checkForChannel.length) {
        AutoPoints.findOneAndDelete({ channelId: id });
    }

    return setAutoPointsChannel(int, id, rq);
}

const setAutoPointsChannel = async (int, id, rq) => {
    const newChannel = {
        channelId: id,
        repAmt: int,
        requirement: rq,
    }

    // add new schema that stores auto point channels
    await new AutoPoints(newChannel).save();

    return true;
}

module.exports = { checkAutoPointsChannel };