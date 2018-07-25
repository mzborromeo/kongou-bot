/*react command*/
/*message processor*/
/*todo fix concurrency with request if there is non async calls use it to avoid conflicts*/
module.exports = (discord,message,config,client,logger,message_type) => {
	let Discord = discord;
	if(message_type.command_name === "react"){
		message.delete(0)
			.then(function(msg){
				/*logger.info("Deleted message from "+msg.author.username+":"+message.id+" after issuing react command");	*/
				const request = require("snekfetch");
				let url_messages = "https://discordapp.com/api/v6/channels/"+message.channel.id+"/messages";
				var request_headers ={headers:{Authorization:"Bot "+process.env.BOT_TOKEN}} 
				request.get(url_messages,request_headers).send().then(function(response){
					let last_message_id = response.body[0].id;
					/*logger.debug("last message id was "+last_message_id);*/
					const emoji_list = client.emojis;
					var react_param = "";
					var emote_name = message_type.parameters[0];
					emoji_list.forEach(function(value,key,map){
						if(emote_name === value.name){
							let animated_string = (value.animated === true)?"a":"";
							react_param = value.name+":"+value.id+"";
							return;
						}
					});
					if(emote_name.toLowerCase() === "lordtim"){
						var unicodes = ["🇱","🇴","🇷","🇩","🇹","🇮","🇲"];
						var last_msg = message.channel.fetchMessage(last_message_id).then(async function(msg){
							for(var x = 0; x<unicodes.length;x++){
								await msg.react(unicodes[x]).then().catch(console.error);
							}
						}).catch(console.error);
					}else if(react_param !== ""){
						let url_react = "https://discordapp.com/api/v6/channels/"+message.channel.id+"/messages/"+last_message_id+"/reactions/"+react_param+"/@me";
						/*logger.debug(url_react);*/
						request.put(url_react,request_headers).send().then(function(response){
							/*logger.debug(response.body);*/
						}).catch(function(err){
							/*logger.error(err);*/
						});
					}
				}).catch(function(err){
					/*logger.error(err);*/
				});				
			}) 
			.catch(console.error);
	}
}
