const { EmbedBuilder } = require("discord.js");
const { Clone } = require("../schemas");
const fetch = require('node-fetch');
require("dotenv").config();


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
                if(msg.attachments.size > 0) {
                    let imgArr = [];
                    msg.attachments.forEach(el => imgArr.push(el.url));

                    if(msg.content.length > 0 && msg.attachments.size === 1) {
                        webhook.send({
                            content: `${msg.content} + ${imgArr[i]}`,
                            username: `${msg.author.username}`,
                            avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
                        });
                    } else {
                        for(let i = 0; i < imgArr.length; i++) {
                            if(i === 0) {
                                webhook.send({
                                    content: `${msg.content}`,
                                    username: `${msg.author.username}`,
                                    avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
                                });
                                webhook.send({
                                    content: `${imgArr[i]}`,
                                    username: `${msg.author.username}`,
                                    avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
                                });
                            } else {
                            webhook.send({
                                content: `${imgArr[i]}`,
                                username: `${msg.author.username}`,
                                avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
                            });
                            }
                        }
                    }
                } else {
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

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if(message.author.bot) return;

        const getCloneId = await Clone.find({ id: 1 });

        if(message.channelId === getCloneId[0]?.cloneFromChannelId) {
            cloneMessage(message, getCloneId[0]?.cloneToChannelId);
        } else {
            return;
        }
    }
}