const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../botconfig/config.json");
const emb = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const IC = require('../botconfig/internalChannels.json');
const emojis = require('../botconfig/emojis.json');
const ms = require("ms");
module.exports = {
  name: "timeout", //the command name for the Slash Command
  description: "Timeout selected member from the server", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['877928758621896834', '966653804734971934', '820648593597530142', '875892036270718996'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		{"User": {name: "user", description: "Who are we timeouting?", required: true}},
		{"StringChoices": {name: "duration", description: "How long should we timeout the user?", required: true, choices: [["1 minute", "60"], ["5 minutes", "300"], ["10 minutes", "600"], ["1 hour", "3600"], ["24 hours", "86400"]]}},
		{"String": {name: "reason", description: "What is the reason for timeout?", required: false}}
	//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		//{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "type", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("type")
		//{"StringChoices": { name: "type", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["API", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("type")
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
		let duration = (parseInt(options.getString("duration"))*1000);
		let reason = options.getString("reason") || "No specific reason provided."
		let logchannel = client.channels.cache.get(IC.logs);
		if(target.roles.highest.position < member.roles.highest.position){
			target.timeout(duration, reason);
			const DMtarget = new MessageEmbed()
			.setTitle(`YOU HAVE BEEN TIMEOUT`)
			.setDescription(`You have been timeout in **${guild.name}** for **${ms(duration, {long: true})}**`)
			.addFields(
				{name: `MODERATOR`, value: `${member.user.tag}`, inline: true},
				{name: `DURATION`, value: `${ms(duration, {long: true})}`, inline: true},
				{name: `REASON`, value: reason}
			)
			.setTimestamp()
			.setThumbnail(guild.iconURL());
			const logmsg = new MessageEmbed()
			.setTitle(`TIMEOUT`)
			.setColor(`GOLD`)
			.setThumbnail(target.displayAvatarURL())
			.setTimestamp()
			.addFields(
				{name: `TARGET`, value: `${target}\n\`${target.user.id}\``, inline: true},
				{name: `MODERATOR`, value: `${member}`, inline: true},
				{name: `DURATION`, value: `${ms(duration, {long: true})}`, inline: true},
				{name: `REASON`, value: reason}
			);
			try {
				target.send({embeds: [DMtarget]})
			} catch(err){
				console.log(err)
			}
			logchannel.send({embeds: [logmsg]});
			interaction.reply({content: `${target} was successfully timeout for \`${ms(duration, {long: true})}\``, ephemeral: true});
		} else {
			interaction.reply({content: `You can't punish that user, they have higher role hierarchy!`, ephemeral: true})
		}
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}