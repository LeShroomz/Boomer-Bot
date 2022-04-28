const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../botconfig/config.json");
const emb = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const IC = require('../../botconfig/internalChannels.json');
const emojis = require('../../botconfig/emojis.json');
const ms = require("ms");
const db = require('quick.db');
const con = require("../../db.js");
module.exports = {
  name: "ask", //the command name for the Slash Command
  description: "Ask immediately new question made by you or fetch from database", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['877928758621896834', '966653804734971934', '820648593597530142', '875892036270718996'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		//{"User": {name: "user", description: "Who are we direct messaging?", required: true}},
		//{"StringChoices": {name: "duration", description: "How long should we timeout the user?", required: true, choices: [["1 minute", "60"], ["5 minutes", "300"], ["10 minutes", "600"], ["1 hour", "3600"], ["24 hours", "86400"]]}},
		{"String": {name: "question", description: "What is the question?", required: false}}
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
        let questionChannel = client.channels.cache.get(IC.questionchannel);
		    let questionToBeAsked = options.getString("question");
        let lastQuestionMessage = db.get(`qotd.message`);

        if(questionToBeAsked == null){
          con.query(`SELECT * FROM questions WHERE asked='0' ORDER BY id ASC`, function (err, res){
            if(res.length > 0){
              questionToBeAsked = res[0].question
              const questionMsg = new MessageEmbed()
              .setTitle(`${emojis.ziggsGif} Question of the Day`)
              .setDescription(questionToBeAsked)
              .setFooter({text: `Question asked by ${res[0].submitter}`})
              .setTimestamp();

              questionChannel.send({embeds: [questionMsg]}).then(msg => {
                if(lastQuestionMessage){
                  questionChannel.messages.cache.get(lastQuestionMessage).unpin().catch(err => console.log(err));
                }
                db.set(`qotd.message`, msg.id);
                msg.pin();
              });
              interaction.reply({content: `Question ID **${res[0].id}** ('*${questionToBeAsked}*') was sent to ${questionChannel}!`, ephemeral: true});
              con.query(`UPDATE questions SET asked='1' WHERE id='${res[0].id}'`)
              db.set(`qotdLAST`, Date.now())
            } else {
              interaction.reply({content: `There are no questions in queue!`})
            }
          })
        } else {
          const logMsg = new MessageEmbed()
          .setTitle(`NEW QUESTION ASKED`)
          .setDescription(questionToBeAsked)
          .addField(`ASKED BY`, `${member}`)
          .setFooter({text: emb.footertext})
          const questionMsg = new MessageEmbed()
          .setTitle(`${emojis.ziggsGif} Question of the Day`)
          .setDescription(questionToBeAsked)
          .setFooter({text: `Question asked by ${member.user.tag}`})
          .setTimestamp();

          interaction.reply({content: `Your questions *${questionToBeAsked}* was sent to ${questionChannel}!`, ephemeral: true});
          db.set(`qotdLAST`, Date.now())
          logChannel.send({embeds: [logMsg]}).then(msg => {
            if(lastQuestionMessage){
              questionChannel.messages.cache.get(lastQuestionMessage).unpin().catch(err => console.log(err));
            }
            db.set(`qotd.message`, msg.id);
            msg.pin();
          });;
          questionChannel.send({embeds: [questionMsg]});
        }
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}