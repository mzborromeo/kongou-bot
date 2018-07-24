const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");


const log4js = require('log4js');
log4js.configure({
	appenders: { 
		system: { 
			type: 'file', 
			filename: 'sys.log', 
			category:'system'
		},
		dm:{ 
			type: 'file', 
			filename: 'dm.log',
			category:'system' 
		}
	},
	categories: { 
		default: { appenders: ['system'], level: 'debug' },
		dm:{ appenders: ['dm'], level: 'debug' },
		system:{ appenders: ['system'], level: 'debug' } 
	}
});

const logger  = log4js.getLogger('system');
const dm_logger  = log4js.getLogger('dm');


client.on("ready", () => {
	client.user.setActivity(`on ${client.guilds.size} servers`);
	console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});

client.on("message", (message) => {
	
	if (message.author.bot) return;/*ignore bots*/
	
	if(message.channel.type === "dm" && message.author.id !== process.env.OWNER_ID){/*dm from other user*/
		dm_logger.info("message from: "+message.author.username+"#"+message.author.discriminator+"("+message.author.id+") containing: "+message.content);
		return;/*ignore dm from others aside from owner*/	
	}
	/*listen to bot owner commands via dm or commands from others via guild text channels*/
	if((message.channel.type === "dm" && message.author.id === process.env.OWNER_ID) || (message.channel.type !== "dm")){
		let message_type_processor = require("./modules/message_processor.js");
		let message_type = message_type_processor(message,config,logger);
		let module_redirector = require("./modules/module_redirector.js");
		let accessed_module = module_redirector(Discord,message,config,client,logger,message_type);
	}

});

client.login(process.env.BOT_TOKEN);