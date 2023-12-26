// Commands for interacting with channels and users in the database
const { ScanChannel, Clone, AutoPoints } = require("../schemas");
const { addToDatabase } = require("./user-util");
const { giveUserPoints } = require("./points-util");
require("dotenv").config();

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
        checkForReq(message, message.author.id, getAutoPointChannels[0].repAmt, getAutoPointChannels[0].requirement);
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


const checkForReq = async (msg, id, pts, rq) => {
    switch(rq) {
        case null:
            rewardUser(msg, id, pts);
            break;
        default:
            if(msg.attachments.size) {
                rewardUser(msg, id, pts);
            }
            break;
    }
}

const rewardUser = async (msg, id, pts) => {
    const response = await giveUserPoints(id, pts);

    switch(typeof response) {
        case "string":
            msg.reply(response);
            break;
        case "boolean":
            if(response === true && pts > 1) {
                await msg.reply(`<@${msg.author.id}> was rewarded ${pts} points!`);
            } else if(response === true) {
                await msg.reply(`<@${msg.author.id}> was rewarded 1 point!`);
            }
            break;
        default:
            await msg.reply("There was an error. Yell at sappy about it.");
            break;
    }
}

module.exports = { addToDatabase, checkForScanChannels, checkForCloneChannels, checkForAutoPointChannels };