// Commands for interacting with channels and users in the database
const { ScanChannel, Clone, AutoPoints } = require("../schemas");
const { getUser, addToDatabase } = require("./user-util");
const { givePoints } = require("./points-util");
require("dotenv").config();
let errorResponse = "There was an issue finding user data. Please let Sappy know so she can fix it. :-)";

const checkForScanChannels = async message => {
    const getScanChannels = await ScanChannel.find({ id: process.env.ENV_ID });

    for(let i = 0; i < getScanChannels[0]?.channels.length; i++) {
        if(getScanChannels[0]?.channels[i] === message.channelId) {
            addToDatabase(message, message.author);
        }
    }
}

const checkForCloneChannels = async message => {
    const getCloneId = await Clone.find({ id: process.env.ENV_ID });

    if(message.channelId === getCloneId[0]?.cloneFromChannelId) {
        cloneMessage(message, getCloneId[0]?.cloneToChannelId);
    }
}

const checkForAutoPointChannels = async message => {
    const getAutoPointChannels = await AutoPoints.find({ channelId: message.channelId });

    if(getAutoPointChannels.length) {
        const response = await rewardUser(message, getAutoPointChannels[0].repAmt, getAutoPointChannels[0].requirement);
        message.reply(response);
    }
}

const cloneMessage = async (msg, bufferCloneId) => {
    if(!bufferCloneId) {
        console.log("There is no buffer clone channel set");
        return;
    }

    msg.client.fetchWebhook(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
        .then(webhook => {
            webhook.edit({
                avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
            })
            .then(webhook => {
                //if there are attachments, create an image array
                if(msg.attachments.size > 0) {
                    let imgArr = [];
                    msg.attachments.forEach(el => imgArr.push(el.url));
                    for(let i = 0; i < imgArr.length; i++) {                        
                        //if there is message content
                        if(i === 0 && msg.content.length > 0) {
                            //send the content,
                            webhook.send({
                                content: `${msg.content}`,
                                username: `${msg.author.username}`,
                                avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
                            });
                            //then send the first attachment
                            webhook.send({
                                content: `${imgArr[i]}`,
                                username: `${msg.author.username}`,
                                avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
                            });
                        //if there is no content, loop through attachments
                        } else {
                            webhook.send({
                                content: `${imgArr[i]}`,
                                username: `${msg.author.username}`,
                                avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
                            });
                        }
                    }
                //if there is only content, just send the content
                } else {
                    // SUCCESS
                    webhook.send({
                        content: `${msg.content}`,
                        username: `${msg.author.username}`,
                        avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
                    });
                }
            })
            .catch(console.error);
        })
        .catch(console.error);
}


const rewardUser = async (message, reward, requirement) => {
    const userInfo = await getUser(message.author);
    let response;

    switch(requirement) {
        case null:
            response = await givePoints(userInfo, reward);
            break;
        default:
            if(message.attachments.size) {
                response = await givePoints(userInfo, reward);
            }
            break;
    }

    if(response != errorResponse) {
        const pointResp = response.toString().replace(`\n`, ` was rewarded ${reward} point!\n`);
        const pointsResp = response.toString().replace(`\n`, ` was rewarded ${reward} points!\n`);
        return reward > 1 ? pointsResp : pointResp;
    } else {
        return errorResponse;
    }
}

module.exports = { addToDatabase, checkForScanChannels, checkForCloneChannels, checkForAutoPointChannels };