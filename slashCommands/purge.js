const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const emb = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const IC = require('../botconfig/internalChannels.json');
const emojis = require('../botconfig/emojis.json');
const ms = require("ms");
const messageCreate = require("../events/guild/messageCreate");
module.exports = {
  name: "purge", //the command name for the Slash Command
  description: "Mass delete messages", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['877928758621896834', '966653804734971934', '820648593597530142', '875892036270718996'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		//{"User": {name: "user", description: "Who are we kicking?", required: true}},
		{"Integer": {name: "amount", description: "How many messages should we delete?", required: true}},
        //{"StringChoices": {name: "purge", description: "How many days worth of messages should we delete?", required: true, choices: [["None", "0"], ["1 day", "1"], ["2 days", "2"], ["3 days", "3"], ["7 days", "7"]]}},
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

		let amount = options.getInteger('amount');

        interaction.channel.bulkDelete(amount, true).then(messages => {
            let logchannel = client.channels.cache.get(IC.logs);
                const logmsg = new MessageEmbed()
                .setTitle(`MESSAGES PURGED`)
                .setColor(`DARK_RED`)
                .setThumbnail(member.displayAvatarURL())
                .setTimestamp()
                .addFields(
                    {name: `TARGET CHANNEL`, value: `${interaction.channel}\n\`${interaction.channel.name}\``, inline: true},
                    {name: `MODERATOR`, value: `${member}`, inline: true},
                    {name: `AMOUNT OF MESSAGES DELETED`, value: `\`${messages.size}\``}
                );

                logchannel.send({embeds: [logmsg]});
                interaction.reply({content: `Deleted \`${messages.size}\` messages from ${interaction.channel}`, ephemeral: true});
        });
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}