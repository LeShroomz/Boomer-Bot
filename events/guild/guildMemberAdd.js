const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const con = require('../../db.js');
const IC = require('../../botconfig/internalChannels.json');

module.exports = async (client, newMember) => {

    let joinLog = new MessageEmbed()
    .setAuthor({name: `USER JOINED`, iconURL: newMember.displayAvatarURL()})
    .setDescription(`${newMember} ${newMember.user.tag}`)
    .setTimestamp()
    .addFields(
        {name: `ID`, value: `${newMember.id}`, inline: true},
        {name: `ACCOUNT CREATED`, value: `${moment(newMember.user.createdAt).format('MMMM Do YYYY')}\n\`${moment(newMember.user.createdAt).fromNow()}\``}
    )

    con.query(`SELECT * FROM visits WHERE user='${newMember.id}'`, function(err, res){
        if(res.length > 0){
            con.query(`UPDATE visits SET visits=visits+1 WHERE user='${newMember.id}'`);
            joinLog.addField(`PREVIOUS VISITS`, `\`${res[0].visits + 1}\``)
        } else {
            con.query(`INSERT INTO visits VALUES ('${newMember.id}', '0')`);
            joinLog.addField(`PREVIOUS VISITS`, `\`N/A\``)
        }
    })

    let joinChannel = client.channels.cache.get(IC['first-hello']);
    await joinChannel.send({embeds: [joinLog]});
}