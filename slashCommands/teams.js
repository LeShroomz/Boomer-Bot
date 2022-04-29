const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../botconfig/config.json");
const emb = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const IC = require('../botconfig/internalChannels.json');
const emojis = require('../botconfig/emojis.json');
const ms = require("ms");
module.exports = {
  name: "teams", //the command name for the Slash Command
  description: "Form teams of two for tournament use for example", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['969373293406716024', '969373287413076059', '966653804734971934', '820648593597530142', '875892036270718996'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		//{"User": {name: "user", description: "Who are we direct messaging?", required: true}},
		//{"StringChoices": {name: "duration", description: "How long should we timeout the user?", required: true, choices: [["1 minute", "60"], ["5 minutes", "300"], ["10 minutes", "600"], ["1 hour", "3600"], ["24 hours", "86400"]]}},
		{"String": {name: "names", description: "Give all names you want to pair, seperated with space", required: true}}
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

        let rawNames = options.getString("names");
        let names = rawNames.split(' ');
        let teams = "";

        if (names.length % 2 != 0) return interaction.reply({content: `You must have even number of names, you currently have ${names.length} names!`, ephemeral: true});

        var arr1 = names.slice(),
            arr2 = names.slice();
        
        arr1.sort(function() {return 0.5 - Math.random();});
        arr2.sort(function() {return 0.5 - Math.random();});

        while (arr1.length){
            var name1 = arr1.pop(),
                name2 = arr2[0] == name1 ? arr2.pop() : arr2.shift();

            teams += `${name1} **&** ${name2}\n`
        }
        await interaction.reply({content: `**Here is your teams:**\n\n${teams}`, ephemeral: true});
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}