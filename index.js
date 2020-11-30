// require the discord.js module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { Client, Message, MessageEmbed} from 'discord.js';
const auth = require('./auth.json');
const ffmpeg = require('ffmpeg');

// create a new Discord client
const client = new Client();
let isReady = true;
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');

    

client.user.setPresence({ type: "CUSTOM_STATUS", activity: { name: 'Next Meeting: 11/30' }, status: 'online' })
/* .then(console.log) */
.catch(console.error);
});
let nextMeeting = '11/30';
let currentLead = 'Cody';

client.on('message', message => {
    let senderID = message.author.id;
    console.log('MESSAGE RECEIVED from', message.author.id);
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
    else if(isReady && message.content.includes('+leader')){
        m
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
  