const { MessageEmbed } = require("discord.js");
const { truncateString } = require("../../handlers/functions");
const IC = require("../../botconfig/internalChannels.json");

module.exports = async (client, oldMessage, newMessage) => {

    if(oldMessage.author.bot) return;
    if(oldMessage.channel.id === '838321823966953472') return;
    if(oldMessage.content != newMessage.content){
        let oldContent = truncateString(oldMessage.content, 1020);
        let newContent = truncateString(newMessage.content, 1020);
        const embed = new MessageEmbed()
        .setAuthor({name: `MESSAGE EDITED`})
        .setDescription(`Edited message in ${newMessage.channel}, [Click to Jump](${newMessage.url})`)
        .addFields(
            {name: `BEFORE`, value: `${oldContent}`},
            {name: `AFTER`, value: `${newContent}`}
        )
        .setTimestamp()
        .setColor(`DARK_AQUA`)
        .setFooter({text: `${newMessage.author.tag}`, iconURL: newMessage.member.displayAvatarURL()})

        client.channels.cache.get(IC.botcommands).send({embeds: [embed]});
    }
}