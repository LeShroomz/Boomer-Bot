const con = require('../../db.js');
const {MessageEmbed} = require('discord.js');
const db = require('quick.db');
const emojis = require('../../botconfig/emojis.json');
const IC = require('../../botconfig/internalChannels.json');
const { change_status } = require("../../handlers/functions");
const moment = require('moment');
module.exports = client => {
  //SETTING ALL GUILD DATA FOR THE DJ ONLY COMMANDS for the DEFAULT
  //client.guilds.cache.forEach(guild=>client.settings.set(guild.id, ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"], "djonlycmds"))
  try{
    //change_status(client);
    ask_question(client);
    //bump_check(client);
    setInterval(()=>{
      change_status(client);
      ask_question(client)
    }, 15 * 1000);
    setInterval(()=>{
      con.query(`SELECT * FROM visits`)
    }, 10000);
  
  } catch (e){
    console.log(String(e.stack).grey.italic.dim.bgRed)
  }
}

function ask_question(client){
  var lastQuestion = db.get(`qotdLAST`);
  const cooldown = 86400000;
  if(lastQuestion !== null && cooldown - (Date.now() - lastQuestion) > 0) return;
  db.set(`qotdLAST`, Date.now())
  con.query(`SELECT * FROM questions WHERE asked='0' ORDER BY id ASC`, function (err, res){
    if(res.length > 0){
      let questionChannel = client.channels.cache.get(IC.questionchannel);
      let lastQuestionMessage = db.get(`qotd.message`);
      questionToBeAsked = res[0].question
      const questionMsg = new MessageEmbed()
      .setTitle(`${emojis.ziggsGif} Question of the Day`)
      .setDescription(questionToBeAsked)
      .setFooter({text: `Question asked by ${res[0].submitter}`})
      .setTimestamp();

      questionChannel.send({embeds: [questionMsg]}).then(msg => {
        if(lastQuestionMessage){
          let lastQuestion = questionChannel.messages.cache.get(lastQuestionMessage)
          if(lastQuestion){
            lastQuestion.unpin()
          }
        }
        db.set(`qotd.message`, msg.id);
        msg.pin();
      });
      con.query(`UPDATE questions SET asked='1' WHERE id='${res[0].id}'`)
    }
  });
}

function bump_check(client){
  var bumpUser = db.get('lastbump.user');
  var bumpTime = db.get('lastbump.time');
  const cooldown = 7200000;
  if(bumpTime !== null && cooldown - (Date.now() - bumpTime) > 0){
    var bumpChannel = client.channels.cache.get(IC.bumpChannel);
    var guild = client.guilds.cache.get(IC.GUILD);
    var user = guild.members.cache.get(bumpUser);
    const embed = new MessageEmbed()
    .setAuthor({name: `TIME TO BUMP AGAIN!`})
    .setDescription(`Hey ${user}! It is time to boost and bump the server once again!`)
    .setColor(`AQUA`);
    bumpChannel.send({embeds: [embed], content: `${user}`});
    user.send({embeds: [embed]}).catch(err => console.log(err));
    db.delete(`lastbump.time`);
  } else {
    console.log(`No need to remind!`)
  }
}
