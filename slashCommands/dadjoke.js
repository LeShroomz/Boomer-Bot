const { MessageEmbed } = require("discord.js");
const joke = require('give-me-a-joke');
const emb = require('../botconfig/embed.json')
module.exports = {
  name: "dadjoke", //the command name for the Slash Command
  description: "Get randomly generated dad joke from Boomer", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
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
        joke.getRandomDadJoke(function(jokehere) {
            const embed = new MessageEmbed()
            .setDescription(jokehere)
            .setFooter({text: emb.footertext, iconURL: member.displayAvatarURL()})

            interaction.reply({embeds: [embed], ephemeral: false});
        })
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}