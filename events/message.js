const { EmbedBuilder } = require("discord.js");
const { Clone } = require("../schemas");

//clone message
const clone = async (msg, bufferCloneId) => {
    const userInfo = msg.author.username;
    if(!bufferCloneId) {
        console.log("There is no buffer clone channel set");
        return;
    }

    const channel = await msg.client.channels.fetch(bufferCloneId);    

    if(msg.attachments.size > 0) {
        if(msg.content.length < 1) {
            textContent = " ";
        } else {
            textContent = msg.content;
        }

        for(let i = 0; i < msg.attachments.size; i++) {
            const imgArr = [];
            msg.attachments.forEach(el => imgArr.push(el.url));
            if(i == 0) {
                const testEmbed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(userInfo)
                    .setDescription(textContent)
                    .setImage(imgArr[0])
                    .setTimestamp();
                                        
                channel.send({ embeds: [testEmbed] });
            } else {
                const testEmbed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(userInfo)
                    .setImage(imgArr[i])
                    .setTimestamp();

                    channel.send({ embeds: [testEmbed] });
            }
        }
    } else {
        const testEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(userInfo)
            .setDescription(msg.content)
            .setTimestamp();

            channel.send({ embeds: [testEmbed] });
    }
}

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if(message.author.bot) return;
        const getCloneId = await Clone.find({ id: 1 });

        if(message.channelId === getCloneId[0]?.cloneFromChannelId) {
            clone(message, getCloneId[0]?.cloneToChannelId);
        } else {
            return;
        }

    }
}