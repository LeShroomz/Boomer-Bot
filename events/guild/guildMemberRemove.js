const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const con = require('../../db.js');
const IC = require('../../botconfig/internalChannels.json');

module.exports = async (client, oldMember) => {

    let rolemap = oldMember.roles.cache.filter(r => r.name !== '@everyone' && r.id !== '891867819254349884' && r.id !== '891869845291958292' && r.id !== '891871013669851136' && r.id !== '891873393505370142' && r.id !== '891874955564838932' && r.id !== '891875754319708190' && r.id !== '891876434254127114').sort((a, b) => b.position - a.position).map(r => r).join(",")
    if(rolemap.length > 1024) rolemap = "Too many roles to display";
    if(!rolemap) rolemap = "No roles to display";
    let quitLog = new MessageEmbed()
    .setAuthor({name: `USER LEFT`, iconURL: oldMember.displayAvatarURL()})
    .setDescription(`${oldMember} ${oldMember.user.tag}`)
    .setTimestamp()
    .addFields(
        {name: `ID`, value: `${oldMember.id}`, inline: true},
        {name: `JOINED`, value: `${moment(oldMember.joinedAt).format('MMMM Do YYYY')}\n\`${moment(oldMember.joinedAt).fromNow()}\``},
        {name: `ROLES`, value: `${rolemap}`}
    )

    let quitChannel = client.channels.cache.get(IC.goodbye);
    await quitChannel.send({embeds: [quitLog]});
}