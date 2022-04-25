const { MessageEmbed } = require("discord.js");
const IC = require("../../botconfig/internalChannels.json");

module.exports = async (client, channel) => {

    const embed = new MessageEmbed()
    .setAuthor({name: `CHANNEL CREATED`})
    .setDescription(`Channel ${channel} \`${channel.name}\` created`)
    .setTimestamp()
    .setColor(`DARK_NAVY`)

    client.channels.cache.get(IC.botcommands).send({embeds: [embed]});
}
