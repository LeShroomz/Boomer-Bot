//Import Modules
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
const IC = require('../../botconfig/internalChannels.json');
const emojis = require("../../botconfig/emojis.json");
const con = require("../../db.js");
module.exports = (client, interaction) => {
	const CategoryName = interaction.commandName;
	let command = false;
  let button = false;
	try{
    	    if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
      		command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand());
    	    }
  	}catch{
    	    if (client.slashCommands.has("normal" + CategoryName)) {
      		command = client.slashCommands.get("normal" + CategoryName);
   	    }
	}
  try{
    if(interaction.isButton()){
      button = true;
    } else {
      button = false;
    }
  }catch (e) {
    console.log(String(e.stack).bgRed)
  }
	if(command) {
		if (onCoolDown(interaction, command)) {
			  return interaction.reply({ephemeral: true,
				embeds: [new Discord.MessageEmbed()
				  .setColor(ee.wrongcolor)
				  .setFooter(ee.footertext, ee.footericon)
				  .setTitle(replacemsg(settings.messages.cooldown, {
					prefix: prefix,
					command: command,
					timeLeft: onCoolDown(interaction, command)
				  }))]
			  });
			}
		//if Command has specific permission return error
        if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction.member.permissions.has(command.memberpermissions)) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
              .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions, {
                command: command,
              }))]
          });
        }
        //if Command has specific needed roles return error
        if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.requiredroles, {
              command: command,
			}))]
          })
        }
        //if Command has specific users return error
        if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.id)) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.alloweduserids, {
              command: command,
            }))]
          });
        }
		//execute the Command
		command.run(client, interaction, interaction.member, interaction.guild)
	}
  // DOING BUTTON STUFF!
  if(button){
    //console.log(interaction);
    if(interaction.customId == 'qotd-approve'){
      let oldEmbed = interaction.message.embeds[0];
      let questionToBeAdded = oldEmbed.description;
      let suggester = oldEmbed.fields[0].value.split('`');
      let logChannel = client.channels.cache.get(IC.logs);
      //console.log(oldEmbed);
      //console.log(suggester[1]);
      con.query(`INSERT INTO questions (question, submitter) VALUES (?, ?)`, [questionToBeAdded, suggester[1]], function (err, res, fields){
        console.log(err);
        const logMsg = new Discord.MessageEmbed()
        .setTitle(`NEW QUESTION ADDED`)
        .setDescription(`${questionToBeAdded}`)
        .addFields(
          {name: `ADDED BY`, value: `${suggester[1]}`, inline: true},
          {name: `APPROVED BY`, value: `${interaction.member}`, inline: true}
        )
        .setFooter({text: `${res.insertId ? `Question ID: ${res.insertId}` : `Question ID: ?`} | ${ee.footertext}`})

        interaction.reply({embeds: [logMsg], ephemeral: true});
        logChannel.send({embeds: [logMsg]});
        interaction.message.delete();
      });
    }
    if(interaction.customId == 'qotd-deny'){
      interaction.reply({content: `You have **denied** qotd suggestion successfully!`, ephemeral: true});
      interaction.message.delete();
    }
  }
}
