const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../botconfig/config.json");
const emb = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const IC = require('../botconfig/internalChannels.json');
const emojis = require('../botconfig/emojis.json');
const ms = require("ms");
module.exports = {
  name: "hug", //the command name for the Slash Command
  description: "Show some affection to someone", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		{"User": {name: "user", description: "Who do you want to hug?", required: true}},
		//{"StringChoices": {name: "duration", description: "How long should we timeout the user?", required: true, choices: [["1 minute", "60"], ["5 minutes", "300"], ["10 minutes", "600"], ["1 hour", "3600"], ["24 hours", "86400"]]}},
		//{"String": {name: "names", description: "Give all names you want to pair, seperated with space", required: true}}
  ],
  run: async (client, interaction) => {
    try{
	    //console.log(interaction, StringOption)
		
		//things u can directly access in an interaction!
		const { member, channelId, guildId, applicationId, 
		        commandName, deferred, replied, ephemeral, 
				options, id, createdTimestamp 
		} = interaction; 
		const { guild } = member;

        let target = guild.members.cache.get(options.getUser("user").id);

        if(target == member){
            const embed = new MessageEmbed()
            .setAuthor({name: `Boomer hugged ${member.user.username}`})
            .setColor(`FUCHSIA`)
            .setImage(`https://c.tenor.com/lzKyZchfMzAAAAAC/anime-hug.gif`)
            .setFooter({text: emb.footertext, iconURL: client.user.displayAvatarURL()});

            interaction.reply({embeds: [embed]});
        } else {
            const embed = new MessageEmbed()
            .setAuthor({name: `${member.user.username} gave sweet big hug to ${target.user.username}`})
            .setImage(`https://c.tenor.com/_BspICsnrcYAAAAC/anime-couple-hug.gif`)
            .setColor(`FUCHSIA`)
            .setFooter({text: emb.footertext, iconURL: client.user.displayAvatarURL()});

            interaction.reply({embeds: [embed]});
        }
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}