// require the discord.js module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { Client, Message, MessageEmbed, Guild} from 'discord.js';
const auth = require('./auth.json');
const ffmpeg = require('ffmpeg');

// create a new Discord client
const client = new Client();

let isReady = true;

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    const guild = client.guilds.cache.get(auth.server);
    if(guild.roles.cache.find(r => r.name === 'Discussion Leader') === undefined){
        console.log('Role not found, creating role...');
        guild.roles.create({
            data: {
                name: 'Discussion Leader',
                color: 'GOLD'
            },
            reason: 'Leader of weekly book discussions'     
        })
        .then(console.log('Role Created'));
    }
    else{
        //gets id of role named 'Discussion Leader'
        console.log(guild.roles.cache.find(r => r.name === 'Discussion Leader').id);
        //console.log(guild.roles.cache.find(r => r.id === '798213168421404702').name);
        console.log('Role already exists!');
 
    }
    client.user.setPresence({ type: "CUSTOM_STATUS", activity: { name: 'Next Meeting: 11/30' }, status: 'online' })
    .catch(console.error);
    console.log('Ready!');
})


let nextMeeting = '11/30';
let currentLead = 'Cody';

client.on('message', message => {
    let senderID = message.author.id;
    //console.log('MESSAGE RECEIVED from', message.author.id);
    console.log('Message:', message.content);
    if (isReady && message.content === '+gong'){
        isReady = false;
        const voiceChannel = message.member.voice.channel;
        voiceChannel.join().then(connection =>{
            const dispatcher = connection.play('./gong(og).mp3');
            dispatcher.on("finish", end => voiceChannel.leave());
            isReady = true;
        }).catch(err => console.log(err));
    }
    else if(isReady && message.content === '+meeting'){
        const embed = new MessageEmbed()
        .setDescription(`Next Meeting: ${nextMeeting}`);
        // Send the embed to the same channel as the message
        message.channel.send({ embed }).catch(console.error);
    }
    else if(isReady && message.content.includes('+set meeting')){
        let date = message.content.slice(message.content.indexOf('g'));
        date = date.slice(2);
        console.log(message.content);
        nextMeeting = date;
        console.log(date);
        client.user.setPresence({type:"LISTENING" ,activity: { name: `Next Meeting: ${nextMeeting}` }, status: 'online' })
                /* .then(console.log) */
                .catch(console.error);           
    }
    else if(isReady && message.content.includes('+set leader')){
        const guild = client.guilds.cache.get(auth.server);
        const {cache} = message.guild.members;
        //command format: +set leader <@newLeader>
        let newLeaderID = message.content.slice(message.content.indexOf('r'));
        newLeaderID = newLeaderID.slice(2);
        newLeaderID = newLeaderID.replace(/[<@!>]/g, '');
        console.log('newLeaderID:', newLeaderID);
        
        //gives the role id of the 'Discussion Leader' role
        let leaderRoleID = guild.roles.cache.find(r => r.name === 'Discussion Leader').id
        //gives the current holder of the role
        let prevLeadID = '';
        if(cache.find(r=>r._roles.includes(leaderRoleID))){
            prevLeadID = cache.find(r => r._roles.includes(leaderRoleID)).user.id;
        } 
        console.log('prevLeadID:', prevLeadID);
        //if theres is someone with the role currently
        if(prevLeadID){
            //remove role from previous leader
            cache.find(m => m.user.id === prevLeadID).roles.remove(leaderRoleID);
            //assign role to new selected leader
            cache.find(m => m.user.id === newLeaderID).roles.add(leaderRoleID);
        }else{
            //assign role to new selected leader
            cache.find(m => m.user.id === newLeaderID).roles.add(leaderRoleID);
        }
    }  

    else if(isReady && message.content === '+help'){
        const embed = new MessageEmbed()
        .setTitle('Right away!')
        .addFields(
            {name: "\`+gong\`", value: 'THE GONG!'},
            {name: "\`+meeting\`", value: 'Gives meeting date for next meeting'},
            {name: "\`+set meeting <MM/DD>\`", value: 'Set next meeting Date(ex: +set meeting 12/18)'},
            {name: "\`+leader\`", value: 'Gives the next designated discussion leader'},
            {name: "\`+set leader\`", value: 'Designates the next discussion leader'},
            {name: "\`+reading\`", value: 'Gives the next designated discussion leader'},
            {name: "\`+assign\`", value: 'Assign reading for the next week'},
        )
        message.channel.send({embed}).catch(console.error);
    }
})


/* client.user.setActivity('Next Meeting: 11/30', {
    type: ""
}); */



// login to Discord with your app's token
client.login(auth.token);
  