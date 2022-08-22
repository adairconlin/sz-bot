const { EmbedBuilder } = require("discord.js");
const { Clone } = require("../schemas");
const fetch = require('node-fetch');
require("dotenv").config();

//clone message
// const clone = async (msg, bufferCloneId) => {
//     const userInfo = msg.author.username;
//     if(!bufferCloneId) {
//         console.log("There is no buffer clone channel set");
//         return;
//     }

//     const channel = await msg.client.channels.fetch(bufferCloneId);    

//     if(msg.attachments.size > 0) {
//         if(msg.content.length < 1) {
//             textContent = " ";
//         } else {
//             textContent = msg.content;
//         }

//         for(let i = 0; i < msg.attachments.size; i++) {
//             const imgArr = [];
//             msg.attachments.forEach(el => imgArr.push(el.url));
//             if(i == 0) {
//                 const testEmbed = new EmbedBuilder()
//                     .setColor("Blurple")
//                     .setTitle(userInfo)
//                     .setDescription(textContent)
//                     .setImage(imgArr[0])
//                     .setTimestamp();
                                        
//                 channel.send({ embeds: [testEmbed] });
//             } else {
//                 const testEmbed = new EmbedBuilder()
//                     .setColor("Blurple")
//                     .setTitle(userInfo)
//                     .setImage(imgArr[i])
//                     .setTimestamp();

//                     channel.send({ embeds: [testEmbed] });
//             }
//         }
//     } else {
//         const testEmbed = new EmbedBuilder()
//             .setColor("Blurple")
//             .setTitle(userInfo)
//             .setDescription(msg.content)
//             .setTimestamp();

//             channel.send({ embeds: [testEmbed] });
//     }
// }

const cloneMessage = async (msg, bufferCloneId) => {
    if(!bufferCloneId) {
        console.log("There is no buffer clone channel set");
        return;
    }

    msg.client.fetchWebhook(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN)
        .then(webhook => {
            console.log(`Obtained webhook with name:  ${webhook.name}`);
            webhook.edit({
                
            })
        })
        .catch(console.error);

    // const channel = await msg.client.channels.fetch(bufferCloneId);

    // console.log("webhook");

    // channel.createWebhook({
    //     name: `${msg.author.username}`,
    //     avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`
    // })
    //     .then(webhook => {
    //         if(msg.attachments.size > 0) {
    //             let imgArr = [];
    //             msg.attachments.forEach(el => imgArr.push(el.url));

    //             if(msg.content.length > 0 && msg.attachments.size === 1) {
    //                 webhook.send({
    //                     content: `${msg.content} + ${imgArr[i]}`,
    //                     username: `${msg.author.username}`,
    //                     avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
    //                 });
    //             } else {
    //                 for(let i = 0; i < imgArr.length; i++) {
    //                     if(i === 0) {
    //                         webhook.send({
    //                             content: `${msg.content}` + `${imgArr[i]}`,
    //                             username: `${msg.author.username}`,
    //                             avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
    //                         });
    //                     } else {
    //                     webhook.send({
    //                         content: `${imgArr[i]}`,
    //                         username: `${msg.author.username}`,
    //                         avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
    //                     });
    //                     }
    //                 }
    //             }
    //         } else {
    //             webhook.send({
    //                 content: `${msg.content}`,
    //                 username: `${msg.author.username}`,
    //                 avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.jpeg`,
    //             });
    //         }

    //         webhook.delete();
    //     })
    //     .catch(error => console.log(error));

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