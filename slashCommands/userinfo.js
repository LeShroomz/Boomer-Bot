const { MessageEmbed } = require("discord.js");
const emb = require('../botconfig/embed.json')
const moment = require('moment');
const ms = require('ms');
module.exports = {
  name: "userinfo", //the command name for the Slash Command
  description: "Get useful information about certain user", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		{"User": {name: "user", description: "Who are we checking?", required: false}},
		//{"StringChoices": {name: "duration", description: "How long should we timeout the user?", required: true, choices: [["1 minute", "60"], ["5 minutes", "300"], ["10 minutes", "600"], ["1 hour", "3600"], ["24 hours", "86400"]]}},
		//{"String": {name: "question", description: "What is the question?", required: false}}
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

        let target = options.getUser('user') ? guild.members.cache.get(options.getUser("user").id) : member;
        let rolemap = target.roles.cache.filter(r => r.name !== '@everyone' && r.id !== '891867819254349884' && r.id !== '891869845291958292' && r.id !== '891871013669851136' && r.id !== '891873393505370142' && r.id !== '891874955564838932' && r.id !== '891875754319708190' && r.id !== '891876434254127114').sort((a, b) => b.position - a.position).map(r => r).join(",")
        if(rolemap.length > 1024) rolemap = "Too many roles to display";
        if(!rolemap) rolemap = "No roles to display";
        const activities = [];
        let customStatus;
        for (const activity of member.presence.activities.values()) {
            switch (activity.type) {
            case 'PLAYING':
                activities.push(`Playing **${activity.name}**`);
                break;
            case 'LISTENING':
                if (member.user.bot) activities.push(`Listening to **${activity.name}**`);
                else activities.push(`Listening to **${activity.details}** by **${activity.state}**`);
                break;
            case 'WATCHING':
                activities.push(`Watching **${activity.name}**`);
                break;
            case 'STREAMING':
                activities.push(`Streaming **${activity.name}**`);
                break;
            case 'CUSTOM_STATUS':
                customStatus = activity.state;
                break;
            }
        }
        let embed = new MessageEmbed()
        .setTitle(`USERINFO`)
        .setAuthor({name: `${target.user.tag}`, iconURL: target.displayAvatarURL()})
        .setFooter({text: emb.footertext, iconURL: client.user.displayAvatarURL()})
        .setThumbnail(target.displayAvatarURL())
        .setColor(target.roles.highest.hexColor)
        .addFields(
            {name: `USERNAME`, value: `\`${target.user.username}\`\n${target}`, inline:true},
            {name: `DISCRIMINATOR`, value: `\`${target.user.discriminator}\``, inline: true},
            {name: `ID`, value: `\`${target.user.id}\``, inline: true},
            {name: `** **`, value: `** **`},
            {name: `JOINED SERVER`, value: `${moment(target.joinedAt).format('MMMM Do YYYY')}\n\`${moment(target.joinedAt).fromNow()}\``, inline: true},
            {name: `ACCOUNT CREATED`, value: `${moment(target.user.createdAt).format('MMMM Do YYYY')}\n\`${moment(target.user.createdAt).fromNow()}\``, inline: true},
            {name: `HIGHEST ROLE`, value: `${target.roles.cache.size ? target.roles.highest : "This member has no roles."}`},
            {name: `ROLES`, value: `${rolemap}`}
        )

        if (activities.length > 0) embed.setDescription(activities.join('\n'));
        if (customStatus) embed.spliceFields(0, 0, { name: 'Custom Status', value: customStatus});
        interaction.reply({embeds: [embed], ephemeral: false});
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}