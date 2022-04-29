const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const IC = require('../../botconfig/internalChannels.json');
const emojis = require('../../botconfig/emojis.json');
const ms = require("ms");
const con = require("../../db.js");
module.exports = {
  name: "remove", //the command name for the Slash Command
  description: "Remove question from QOTD database", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['969373293406716024', '969373287413076059', '966653804734971934', '820648593597530142', '875892036270718996'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		//{"User": {name: "user", description: "Who are we direct messaging?", required: true}},
		//{"StringChoices": {name: "duration", description: "How long should we timeout the user?", required: true, choices: [["1 minute", "60"], ["5 minutes", "300"], ["10 minutes", "600"], ["1 hour", "3600"], ["24 hours", "86400"]]}},
		{"Integer": {name: "question_id", description: "What question should we delete? Provide valid ID", required: true}}
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
		let questionID = options.getInteger("question_id");

        con.query(`SELECT * FROM questions WHERE id='${questionID}'`, function (err, res){
            if(res.length > 0){
                const logMsg = new MessageEmbed()
                .setTitle(`QUESTION REMOVED`)
                .setDescription(`${res[0].question}`)
                .addField(`ORIGINALLY ADDED BY`, `${res[0].submitter}`, true)
                .addField(`REMOVED BY`, `${member}`, true)
                .setFooter({text: `${emb.footertext}`})

                interaction.reply({embeds: [logMsg], ephemeral: true});
                logChannel.send({embeds: [logMsg]});
                con.query(`DELETE FROM questions WHERE id='${questionID}'`)
            } else {
                interaction.reply({content: `No question by ID **${questionID}** was found?!`, ephemeral: true});
            }
        })
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}