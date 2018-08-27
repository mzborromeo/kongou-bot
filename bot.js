const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const request = require('ajax-request');
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

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
		default: { appenders: ['system'], level: 'off' },
		dm:{ appenders: ['dm'], level: 'off' },
		system:{ appenders: ['system'], level: 'off' } 
	}
});

const logger  = log4js.getLogger('system');
const dm_logger  = log4js.getLogger('dm');
function GlobalParam(){
	this.discord = Discord;
	this.client  = client;
	this.config  = config;
	this.request = request;
	this.logger  = logger;
	this.customsearch = customsearch
	this.message = undefined;
	this.env_vars = process.env; 
	var self = this;
	this.setMessage = function(message_param){
		self.message = message_param;
	};

	this.getMessage = function(){
		return self.message;
	}
};

var global_settings = {
	f2p:false,
	bff:false,
	gei:false
};

client.on("ready", () => {
	var monitoring_status = "to "+client.guilds.size+" guilds, "+client.users.size+" users";
	var activities = [
		{name:"with Teitoku",type:"PLAYING"},
		{name:"Honkai Impact 3rd",type:"PLAYING"},
		{name:"Fate/Grand Order",type:"PLAYING"},
		{name:"you",type:"WATCHING"},
		{name:"Chibi valks in my dorm",type:"WATCHING"},
		{name:"Blank's MMD video",type:"WATCHING"},
		{name:"you as you speak",type:"LISTENING"},
		{name:monitoring_status,type:"LISTENING"}
	];
	var interval = setInterval(function(){
		var random_index = 6;//Math.floor(Math.random() * (activities.length - 0) + 0);
		monitoring_status = "to "+client.guilds.size+" guilds, "+client.users.size+" users";
		if(activities[random_index].type !== "STREAMING"){
			client.user.setActivity(activities[random_index].name,{type:activities[random_index].type});
		}
		
	},60000);
	console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});

client.on("message", (message) => {
	var global_params = new GlobalParam();
	global_params.setMessage(message);
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
		let accessed_module = module_redirector(global_params,global_settings,message_type);
	}

});

client.on("messageDelete",(message) => {
	/*mirai,kongou, and rin id
		447307869532979202 user-logs channel
		447355800126488576 hr channel
	*/
	if(message.channel.id === "447355800126488576" && (message.author.id === "125367104336691200" || message.author.id === "469873642449141770" || message.author.id === "471592678711361546")){
		message.channel.send("",{embed:{
			title:message.embeds[0].title,
			description:message.embeds[0].description,
			color:message.embeds[0].color,
			author:{
				name:message.embeds[0].author.name,
				icon_url:message.embeds[0].author.iconURL
			},
			timestamp:message.embeds[0].timestamp
		}}).then().catch(err => logger.debug(err));
	}
});

client.on("messageDeleteBulk",(messages) => {
	messages.forEach(function(message,key,map){
	/*mirai,kongou, and rin id
		447307869532979202 user-logs channel
		447355800126488576 hr channel
	*/
		if(message.channel.id === "447355800126488576" && (message.author.id === "125367104336691200" || message.author.id === "469873642449141770" || message.author.id === "471592678711361546")){
			message.channel.send("",{embed:{
				title:message.embeds[0].title,
				description:message.embeds[0].description,
				color:message.embeds[0].color,
				author:{
					name:message.embeds[0].author.name,
					icon_url:message.embeds[0].author.iconURL
				},
				timestamp:message.embeds[0].timestamp
			}}).then().catch(err => logger.debug(err));
		}
	});
});
/*test auto deploy*/
client.login(process.env.BOT_TOKEN);
