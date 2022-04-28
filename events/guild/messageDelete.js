const { MessageEmbed } = require("discord.js");
const { truncateString } = require("../../handlers/functions");
const IC = require("../../botconfig/internalChannels.json");

module.exports = async (client, message) => {

    if(message.author && message.author.bot) return;
    if(message.channel.id === '838321823966953472') return;

    if(message.attachments.size > 0){
        if (message.attachments.every(attachIsImage)){
            let embedimg = new MessageEmbed()
            .setAuthor({name: `IMAGE DELETED`})
            .setDescription(`Image sent by ${message.author.tag} in ${message.channel} was deleted`)
            .setImage(message.attachments.first().proxyURL)
            .setTimestamp()
            .setColor(`DARK_RED`)
            .setFooter({text: `Author ID: ${message.author.id}`, iconURL: message.member.displayAvatarURL()})

            client.channels.cache.get(IC.botcommands).send({embeds: [embedimg]});
        }
    }

    if(message.content != null && message.content.length > 0){
        let oldContent = truncateString(message.content, 1020);
        let embed = new MessageEmbed()
        .setAuthor({name: `MESSAGE DELETED`})
        .setDescription(`Message sent by ${message.author.tag} in ${message.channel} was deleted`)
        .addFields(
            {name: `MESSAGE`, value: `${oldContent}`},
        )
        .setTimestamp()
        .setColor(`DARK_RED`)
        .setFooter({text: `Author ID: ${message.author.id}`, iconURL: message.member.displayAvatarURL()})

        client.channels.cache.get(IC.botcommands).send({embeds: [embed]});
    }
}

function attachIsImage(msgAttach) {
    var url = msgAttach.url;
    //True if this url is a png image.
    return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
}
