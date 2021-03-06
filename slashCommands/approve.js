const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../botconfig/config.json");
const emb = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const IC = require('../botconfig/internalChannels.json');
const emojis = require('../botconfig/emojis.json');
const ms = require("ms");
module.exports = {
  name: "approve", //the command name for the Slash Command
  description: "Approve and welcome new member to the server!", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: ['969373293406716024', '969373287413076059', '966653804734971934', '820648593597530142', '875892036270718996', '870983849880985630'], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
        {"User": {name: "user", description: "Who are we welcoming to the server?", required: true}},
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
        let generalCh = client.channels.cache.get(IC.general);

        target.roles.add(['801868392679604225']);
        const welcomeDM = new MessageEmbed()
        .setTitle(`YOU HAVE BEEN WELCOMED TO RAINBOW SUMMONERS!`)
        .setDescription(`Welcome to **Rainbow Summoners [EUW]**, ${target}!\n\nTime to go explore <#704306122529439747>!`)
        .setImage(`https://media2.giphy.com/media/q7okuo9cVTiHVsueiJ/giphy.gif`)
        const welcomeMsg = new MessageEmbed()
        .setTitle(`A NEW CHALLENGER HAS ARRIVED!`)
        .setDescription(`Welcome to **Rainbow Summoners [EUW]**, ${target}!\n\n**Don't know where to start?**\n\`=\` Check out <#774556617504980993> & <#871109213848489994>\n\`=\` Pick some roles <#734787513293471896>\n\`=\` Tell us about yourself in <#812239615070306304>`)
        .setImage(`https://media2.giphy.com/media/q7okuo9cVTiHVsueiJ/giphy.gif`)
        .setFooter({text: `Every step; a new journey...`})
        .setColor(`DARK_PURPLE`)
        .setThumbnail(target.displayAvatarURL());
        const logmsg = new MessageEmbed()
        .setTitle(`NEW USER WELCOMED IN!`)
        .setColor(`DARK_BUT_NOT_BLACK`)
        .setThumbnail(target.displayAvatarURL())
        .setTimestamp()
        .addFields(
            {name: `NEW USER`, value: `${target}\n\`${target.user.id}\``, inline:true},
            {name: `MODERATOR`, value: `${member}`, inline: true}
        );

        logchannel.send({embeds: [logmsg]});
        generalCh.send({embeds: [welcomeMsg]});
        target.send({embeds: [welcomeDM]}).catch(err => console.log(err));
        interaction.reply({content: `Successfully welcomed ${target}`, ephemeral: true});
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}