/*react command*/
module.exports = (discord,message,config,client,logger,message_type) => {
	let Discord = discord;
	if(message_type.command_name === "react"){
		var last_message_id = undefined;
		message.channel.fetchMessages({ limit: 2})
		.then(function(messages){
			messages.forEach(function(value,key,map){
				if(value.id !== message.id){
					last_message_id = value.id;
					/*logger.debug("last message id was "+last_message_id);*/
					const emoji_list = client.emojis;
					var react_id = "";
					var emote_name = message_type.parameters[0];
					emoji_list.forEach(function(value,key,map){
						if(emote_name === value.name){
							let animated_string = (value.animated === true)?"a":"";
							react_id = value.id;
							return;
						}
					});	

					if(emote_name.toLowerCase() === "lordtim"){
						message.delete(0)
							.then(async function(msg){
								var unicodes = ["🇱","🇴","🇷","🇩","🇹","🇮","🇲"];
								for(var x = 0; x<unicodes.length;x++){
									await value.react(unicodes[x]).then().catch(console.error);
								}
							}).catch(console.error);						
					}else if(emote_name.toLowerCase() === "gei"){
						message.delete(0)
							.then(async function(msg){
								var unicodes = ["🇬","🇪","🇮"];
								for(var x = 0; x<unicodes.length;x++){
									await value.react(unicodes[x]).then().catch(console.error);
								}
							}).catch(console.error);
					}else if(react_id !== ""){
						message.delete(0)
							.then(async function(msg){
								/*logger.info("Deleted message from "+msg.author.username+":"+message.id+" after issuing react command requesting for "+react_id);*/	
								await value.react(client.emojis.get(react_id)).then(function(){
								}).catch(console.error);			
							}) 
							.catch(console.error);
					}	

				}
			});
		})
		.catch(console.error);		
	}
}
