const { MessageEmbed } = require("discord.js");
const emojis = require("../../botconfig/emojis.json");
const IC = require("../../botconfig/internalChannels.json");

module.exports = async (client, message) => {
    if(message.channel.type == 'DM'){
        if(!message.author.bot){
            let staffChannel = client.channels.cache.get(IC.adminchat);
            let botCommandsChannel = client.channels.cache.get(IC.botcommands);
            const embedReply = new MessageEmbed()
            .setDescription(`Your DM was forwarded to Rainbow Summoner's staff team!`)
            .setFooter({text: `Please refrain from spamming, this can lead to punishment!`, iconURL: client.user.displayAvatarURL()});

            let embedToStaff = new MessageEmbed()
            .setTitle(`NEW DM FROM USER`)
            .setDescription(message.content)
            .addFields(
                {name: `SENDER`, value: `${message.author}\n\`${message.author.id}\``}
            )
            .setFooter({text: `You can reply to user with /dm command`})

            if(message.attachments.size > 0){
                staffChannel.send({embeds: [embedToStaff], attachments: [message.attachments[0]]})
                botCommandsChannel.send({embeds: [embedToStaff], attachments: [message.attachments[0]]})
            } else {
                staffChannel.send({embeds: [embedToStaff]})
                botCommandsChannel.send({embeds: [embedToStaff]})
            }
            message.reply({embeds: [embedReply]});
            message.react(emojis.ziggs);
        }
    }
    if(message.channel.id == '817022179245686874'){
        if(message.author.bot && message.author.id == '302050872383242240'){
            let messageEmbed = message.embeds[0];
            if(messageEmbed.description.toLowerCase().includes("Bump done!")){
                let user = message.interaction.user;
                const embed = new MessageEmbed()
                .setDescription(`Thank you ${user.username} for bumping our server!`)

                client.channels.cache.get('817022179245686874').send({embeds: [embed]});
            }
        }
    }
}