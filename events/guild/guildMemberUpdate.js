const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const con = require('../../db.js');
const IC = require('../../botconfig/internalChannels.json');

module.exports = async (client, oldMember, newMember) => {

    let logChannel = client.channels.cache.get(IC.botcommands);
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        let logMsg = new MessageEmbed()
        .setAuthor({name: `ROLE ADDED`, iconURL: newMember.displayAvatarURL()})
        .setTimestamp()
        .setColor(`ORANGE`)

        newMember.roles.cache.forEach(role => {
            if(!oldMember.roles.cache.has(role.id)){
                logMsg.setDescription(`${newMember} was **given role** ${role} \`${role.name}\``)
            }
        })

        logChannel.send({embeds: [logMsg]});
    } else if (oldMember.roles.cache.size > newMember.roles.cache.size){
        let logMsg = new MessageEmbed()
        .setAuthor({name: `ROLE REMOVED`, iconURL: newMember.displayAvatarURL()})
        .setTimestamp()
        .setColor(`ORANGE`)

        oldMember.roles.cache.forEach(role => {
            if (!newMember.roles.cache.has(role.id)) {
                logMsg.setDescription(`${newMember} was **removed from role** ${role} \`${role.name}\``)
            }
        })
    }
}