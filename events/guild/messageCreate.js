const { MessageEmbed } = require("discord.js");
const db = require('quick.db');
const emojis = require("../../botconfig/emojis.json");
const IC = require("../../botconfig/internalChannels.json");

module.exports = async (client, message) => {

    if(message.channel.id === IC.selfies){
        if(message.attachments.size > 0){
            message.startThread({name: `${message.author.username} comments`, autoArchiveDuration: 1440, reason: `Selfie comments`});
        }
    }

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
    if(message.channel.type != 'DM'){
        let content = message.content.toLowerCase()
        let arny = message.guild.members.cache.get('861203265178173470');
        let doctor = message.guild.members.cache.get('144982644764049418');
        let pete = message.guild.members.cache.get('372740660736032768');
        let zach = message.guild.members.cache.get('355657266575179776');
        let aiko = message.guild.members.cache.get('618686265830801424');
        let ducky = message.guild.members.cache.get('706822649606701086');
        let defend = message.guild.members.cache.get('221913832765784064');
        if(content.includes("who is") && message.mentions.has(arny)){
            message.react(emojis.ziggsGif);
            message.reply({content: `Well ${arny.user.username} is the best person in the world of course?`})
        } else if(content.includes("who is") && message.mentions.has(doctor)){
            message.react(emojis.ziggsGif);
            message.reply({content: `${doctor.user.username} is the most innocent person on the planet, and if you go horni rampage, he will execute you faster than Yone kills Yasuo...`})
        } else if(content.includes("who is") && message.mentions.has(zach)){
            message.react(emojis.ziggsGif);
            message.reply({content: `Don't step on ${zach.user.username} toes, or you will find yourself sleeping on the couch, outside, in the rain, without clothes.. *and robbed* :sunglasses:`})
        } else if(content.includes("who is") && message.mentions.has(aiko)){
            message.react(emojis.ziggsGif);
            message.reply({content: `MOMMY :weary: :hot_face:`})
        } else if(content.includes("who is") && message.mentions.has(ducky)){
            message.react(emojis.ziggsGif);
            message.reply({content: `**KWAAK**, I mean, just a person who wants you to be his pillow! :heart:`})
        } else if(content.includes("who is") && message.mentions.has(defend)){
            message.react(emojis.ziggsGif);
            message.reply({content: `I don't dare to say much as he might smite me off the server. He is the server daddy, big twink who can come across a little quiet. ||*Just check his Reddit...*||`})
        }
    }
    /*
    if(message.channel.id == '817022179245686874'){
        console.log(true);
        if(message.author.bot && message.author.id == '302050872383242240'){
            console.log(message);
            let messageEmbed = message.embeds[0];
            if(messageEmbed.description.toLowerCase().includes("bump done")){
                let user = message.interaction.user;
                const embed = new MessageEmbed()
                .setDescription(`Thank you ${user.username} for bumping our server! I will remind you in **2 hours** to bump!`)

                db.set(`lastbump`, {user: user, time: Date.now()})
                client.channels.cache.get('817022179245686874').send({embeds: [embed]});
            }
        }
    }
    */
}