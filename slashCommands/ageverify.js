const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../botconfig/config.json");
const emb = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const IC = require('../botconfig/internalChannels.json');
const emojis = require('../botconfig/emojis.json');
const ms = require("ms");
module.exports = {
  name: "ageverify", //the command name for the Slash Command
  description: "Verify members age and verify it", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['877928758621896834', '966653804734971934', '820648593597530142', '875892036270718996'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
        {"User": {name: "user", description: "User to age verify", required: true}},
        //{"String": {name: "reason", description: "What is the reason?", required: true}},
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

		let target = guild.members.cache.get(options.getUser("user").id);
		let logchannel = client.channels.cache.get(IC.logs);

        target.roles.add(['971071032356118638']);
        const DM = new MessageEmbed()
        .setTitle(`YOU HAVE BEEN AGE VERIFIED`)
        .setDescription(`${member} has verified your age. This means you have been granted access to our age restricted channels, including <#969654640390053969>.`)
        .setImage(`https://c.tenor.com/ufGaFbf1s88AAAAC/jayce-viktor.gif`)

        const logmsg = new MessageEmbed()
        .setTitle(`USER AGE VERIFIED`)
        .setColor(`DARK_BUT_NOT_BLACK`)
        .setThumbnail(target.displayAvatarURL())
        .setTimestamp()
        .addFields(
            {name: `USER`, value: `${target}\n\`${target.user.id}\``, inline:true},
            {name: `MODERATOR`, value: `${member}`, inline: true}
        );

        logchannel.send({embeds: [logmsg]});
        target.send({embeds: [DM]}).catch(err => console.log(err));
        interaction.reply({content: `Successfully age verified ${target}`, ephemeral: true});
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}