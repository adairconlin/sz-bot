// Commands for interacting with channels and users in the database
const { Clone, AutoPoints } = require("../schemas");
const { getUser } = require("./user-util");
const { givePoints } = require("./points-util");
require("dotenv").config();

const removeMentions = async message => {
    if(message.content.includes("@")) {
        message.content = message.content.replaceAll("@", "@/");
        if(message.mentions?.users?.size > 0) {
            message.mentions?.users?.map(user => {
                let identifier = user?.globalName ? user?.globalName : user?.username;
                message.content = message.content.replace(`<@/${user?.id}>`, `@/${identifier}`);
            });
        }
    }
}

const checkIfCloneChannel = async message => {
    const getCloneId = await Clone.find({ id: process.env.ENV_ID });

    if(message.channelId === getCloneId[0]?.cloneFromChannelId) {
        removeMentions(message);
        cloneMessage(message, getCloneId[0]?.cloneToChannelId);
    }
}

const checkIfAutoPointChannel = async message => {
    const getAutoPointChannels = await AutoPoints.find({ channelId: message.channelId });

    if(getAutoPointChannels.length) {
        const response = await rewardUser(message, getAutoPointChannels[0].repAmt, getAutoPointChannels[0].requirement);
        response != null && message.reply(response);
    }
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
            } else {
                response = null;
            }
            break;
    }

    return response;
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

module.exports = { checkIfCloneChannel, checkIfAutoPointChannel };