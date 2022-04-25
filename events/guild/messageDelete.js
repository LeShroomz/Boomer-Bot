const { MessageEmbed } = require("discord.js");
const { truncateString } = require("../../handlers/functions");
const IC = require("../../botconfig/internalChannels.json");

module.exports = async (client, message) => {

    if(message.author && message.author.bot) return;
    if(message.content == null){
        if(message.embeds[0] != null){
            let embed = message.embeds[0];
            embed.setAuthor({name: `MESSAGE DELETED`}).setDescription(`Deleted message in ${message.channel}`)

            await client.channels.cache.get(IC.botcommands).send({embeds: [embed]});
        } else return;
    } else {
        let oldContent = truncateString(message.content, 1020);
        let embed = new MessageEmbed()
        .setAuthor({name: `MESSAGE DELETED`})
        .setDescription(`Deleted message in ${message.channel}`)
        .addFields(
            {name: `MESSAGE`, value: `${oldContent}`},
        )
        .setTimestamp()
        .setColor(`DARK_RED`)
        .setFooter({text: `${message.author.tag}`, iconURL: message.member.displayAvatarURL()})

        await client.channels.cache.get(IC.botcommands).send({embeds: [embed]});
    }
}
