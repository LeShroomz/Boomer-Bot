const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const IC = require('../../botconfig/internalChannels.json');
const emojis = require('../../botconfig/emojis.json');
const ms = require("ms");
const con = require("../../db.js");
module.exports = {
  name: "add", //the command name for the Slash Command
  description: "Add notes to users profile", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['969373293406716024', '969373287413076059', '966653804734971934', '820648593597530142', '875892036270718996'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		{"User": {name: "user", description: "Who are we writing notes about?", required: true}},
		//{"StringChoices": {name: "duration", description: "How long should we timeout the user?", required: true, choices: [["1 minute", "60"], ["5 minutes", "300"], ["10 minutes", "600"], ["1 hour", "3600"], ["24 hours", "86400"]]}},
		{"String": {name: "notes", description: "What should the note say?", required: true}}
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

        let logChannel = client.channels.cache.get(IC.logs);
        let watchChannel = client.channels.cache.get(IC.watchchannel);
        let target = guild.members.cache.get(options.getUser("user").id);
		let notesToBeAdded = options.getString("notes");

        if(notesToBeAdded.length <= 1024){
            con.query(`INSERT INTO notes (user, note, moderator) VALUES ('${target.user.id}', ?, '${member.user.id}')`, [notesToBeAdded], function (err, res, fields){
            const logMsg = new MessageEmbed()
            .setAuthor({name: `NOTE ADDED`, iconURL: target.displayAvatarURL()})
            .setDescription(`${notesToBeAdded}`)
            .addField(`USER`, `${target}`)
            .addField(`MODERATOR`, `${member}`)
            .setFooter({text: `Note ID: ${res.insertId} | ${emb.footertext}`})

            interaction.reply({embeds: [logMsg], ephemeral: true});
            logChannel.send({embeds: [logMsg]});
            watchChannel.send({embeds: [logMsg]});
            })
        } else {
            interaction.reply({content: `Your note is too long, note can only be 1024 characters or less!`, ephemeral: true});
        }
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}