const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const IC = require('../../botconfig/internalChannels.json');
const emojis = require('../../botconfig/emojis.json');
const moment = require("moment");
const con = require("../../db.js");
module.exports = {
  name: "delete", //the command name for the Slash Command
  description: "Delete specific note", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['877928758621896834', '966653804734971934', '820648593597530142', '875892036270718996'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		{"Integer": {name: "id", description: "ID of the note you want deleted", required: true}},
		//{"StringChoices": {name: "duration", description: "How long should we timeout the user?", required: true, choices: [["1 minute", "60"], ["5 minutes", "300"], ["10 minutes", "600"], ["1 hour", "3600"], ["24 hours", "86400"]]}},
		//{"String": {name: "notes", description: "What should the note say?", required: true}}
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
        let noteID = options.getInteger("id")

        con.query(`SELECT * FROM notes WHERE id='${noteID}'`, function (err, res){
            if(res.length > 0){
                let logMsg = new MessageEmbed()
                .setTitle(`NOTE DELETED`)
                .setDescription(`Following note was **deleted** by ${member}\n${moment(res[0].date).format('DD/MM/YYYY')} - ${interaction.guild.members.cache.get(res[0].moderator).user.tag}\n${res[0].note}`)
                .setTimestamp()
                .setColor(`DARK_RED`)
                .setFooter({text: emb.footertext, iconURL: client.user.displayAvatarURL()})

                con.query(`DELETE FROM notes WHERE id='${noteID}'`);

                interaction.reply({content: `You have **successfully** deleted note by ID ${noteID}`})
                logChannel.send({embeds: [logMsg]});
                watchChannel.send({embeds: [logMsg]});
            } else {
                const noNotes = new MessageEmbed().setDescription(`Could not find any notes by ID ${noteID}!`).setColor(`DARK_RED`);
                interaction.reply({embeds: [noNotes], ephemeral: true})
            }
        })
    
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}