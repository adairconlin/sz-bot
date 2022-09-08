const { Clone, ScanChannel, User } = require("../schemas");
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

const addToDatabase = async msg => {
    //await User.deleteMany({});
    const findUser = await User.find({ discordId: msg.author.id});
    console.log("find user");
    console.log(findUser);

    if(!findUser.length) {
        const newUser = {
            username: msg.author.username,
            discordId: msg.author.id,
            pointsAmt: 3
        }
        await new User(newUser).save()
            .then(() => {
                msg.reply("Welcome to the Lemon Art Database! Here's 3 Points <3");
            })
    }
}

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if(message.author.bot) return;

        //checking for necessary database events
        const getScanChannels = await ScanChannel.find({ id: process.env.ENV_ID });
        console.log(getScanChannels);

        for(let i = 0; i < getScanChannels[0]?.channels.length; i++) {
            if(getScanChannels[0]?.channels[i] === message.channelId) {
                console.log("is a scan channel");
                addToDatabase(message);
                return;
            }
        }

        // checking for necessary clone events
        const getCloneId = await Clone.find({ id: process.env.ENV_ID });

        if(message.channelId === getCloneId[0]?.cloneFromChannelId) {
            cloneMessage(message, getCloneId[0]?.cloneToChannelId);
            return;
        } else {
            return;
        }
    }
}