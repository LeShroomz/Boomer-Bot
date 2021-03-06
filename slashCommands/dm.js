const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../botconfig/config.json");
const emb = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const IC = require('../botconfig/internalChannels.json');
const emojis = require('../botconfig/emojis.json');
const ms = require("ms");
module.exports = {
  name: "dm", //the command name for the Slash Command
  description: "Send direct message to specific user using Rammus", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['969373293406716024', '969373287413076059', '966653804734971934', '820648593597530142', '875892036270718996'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		{"User": {name: "user", description: "Who are we direct messaging?", required: true}},
		//{"StringChoices": {name: "duration", description: "How long should we timeout the user?", required: true, choices: [["1 minute", "60"], ["5 minutes", "300"], ["10 minutes", "600"], ["1 hour", "3600"], ["24 hours", "86400"]]}},
		{"String": {name: "message", description: "What are we sending?", required: true}}
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
		let messageToSend = options.getString("message");
		let logchannel = client.channels.cache.get(IC.logs);
        const DMtarget = new MessageEmbed()
        .setTitle(`YOU HAVE BEEN CONTACTED BY STAFF`)
        .setDescription(messageToSend)
        .addFields(
            {name: `SENT BY`, value: `${member.user.tag}`, inline: true},
        )
        .setTimestamp()
        .setThumbnail(guild.iconURL());
        const logmsg = new MessageEmbed()
        .setTitle(`DM SENT`)
        .setColor(`GREEN`)
        .setThumbnail(target.displayAvatarURL())
        .setTimestamp()
        .setDescription(messageToSend)
        .addFields(
            {name: `TARGET`, value: `${target}\n\`${target.user.id}\``, inline: true},
            {name: `MODERATOR`, value: `${member}`, inline: true},
        );
        target.send({embeds: [DMtarget]}).then(msg => {
            interaction.reply({content: `${target} was messaged successfully by you for \`${messageToSend}\``, ephemeral: true});
            logchannel.send({embeds: [logmsg]});
        }).catch(err => {
            console.log(err);
            interaction.reply({content: `${target} does not have their DMs enabled on this server, message could not be sent`, ephemeral: true})
        })
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}