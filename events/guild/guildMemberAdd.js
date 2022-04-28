const { MessageEmbed } = require('discord.js');
const emojis = require('../../botconfig/emojis.json')
const moment = require('moment');
const con = require('../../db.js');
const IC = require('../../botconfig/internalChannels.json');
const emb = require('../../botconfig/embed.json');

module.exports = async (client, newMember) => {

    let joinChannel = client.channels.cache.get(IC['first-hello']);
    let joinLog = new MessageEmbed()
    .setAuthor({name: `USER JOINED`, iconURL: newMember.displayAvatarURL()})
    .setDescription(`${newMember} ${newMember.user.tag}`)
    .setTimestamp()
    .addFields(
        {name: `ID`, value: `${newMember.id}`, inline: true},
        {name: `ACCOUNT CREATED`, value: `${moment(newMember.user.createdAt).format('MMMM Do YYYY')}\n\`${moment(newMember.user.createdAt).fromNow()}\``}
    )

    let instructions = new MessageEmbed()
    .setAuthor({name: `Welcome ${newMember.user.username}!`, iconURL: newMember.displayAvatarURL()})
    .setDescription(`Please answer the questions above to gain access to the server! Feel free to ask any questions that you might have ${emojis.ziggs}`)
    .setFooter({text: emb.footertext})
    .setTimestamp();
    client.channels.cache.get(IC.accesschannel).send({content: `${newMember}`, embeds: [instructions]});

    con.query(`SELECT * FROM visits WHERE user='${newMember.id}'`, function(err, res){
        if(err != null) return console.log(err);
        if(res.length > 0){
            con.query(`UPDATE visits SET visits=visits+1 WHERE user='${newMember.id}'`);
            joinLog.addField(`PREVIOUS VISITS`, `\`${res[0].visits + 1}\``)
            joinChannel.send({embeds: [joinLog]});
        } else {
            con.query(`INSERT INTO visits VALUES ('${newMember.id}', '1')`);
            joinChannel.send({embeds: [joinLog]});
        }
    })
}