/*react command*/
module.exports = (global_params,global_settings,message_type) => {
	let Discord = global_params.discord;
	if(message_type.command_name === "react"){
		var last_message_id = undefined;
		global_params.message.channel.fetchMessages({ limit: 2})
		.then(function(messages){
			messages.forEach(function(value,key,map){
				if(value.id !== global_params.message.id){
					last_message_id = value.id;
					global_params.logger.debug("last message id was "+last_message_id);
					const emoji_list = global_params.client.emojis;
					var react_id = "";
					var emote_name = message_type.parameters[0];
					emoji_list.forEach(function(value,key,map){
						let emote_name_str = ""+emote_name;
						emote_name_str = emote_name_str.toLowerCase();
						let value_str = ""+value.name;
						value_str =  value_str.toLowerCase();						
						if(emote_name_str === value_str){
							let animated_string = (value.animated === true)?"a":"";
							react_id = value.id;
							return;
						}
					});	

					if(emote_name.toLowerCase() === "lordtim"){
						global_params.message.delete(0)
							.then(async function(msg){
								var unicodes = ["🇱","🇴","🇷","🇩","🇹","🇮","🇲"];
								for(var x = 0; x<unicodes.length;x++){
									await value.react(unicodes[x]).then().catch(console.error);
								}
							}).catch(console.error);						
					}else if(emote_name.toLowerCase() === "gei"){
						global_params.message.delete(0)
							.then(async function(msg){
								var unicodes = ["🇬","🇪","🇮"];
								for(var x = 0; x<unicodes.length;x++){
									await value.react(unicodes[x]).then().catch(console.error);
								}
							}).catch(console.error);
					}else if(emote_name.toLowerCase() === "mwheel"){
						global_params.message.delete(0).then(async function(){
							var unicodes = ["🐳","🐋","🐙","🦑","🇼","🇭","🇦","🇱","🇪"];
							for(var x = 0; x<unicodes.length;x++){
								await value.react(unicodes[x]).then()
								.catch();
							}
						}).catch(console.error);
					}else if(emote_name.toLowerCase() === "combobreak"){
						global_params.message.delete(0).then(async function(){
							var unicodes = ["🇨","🇴","🇲","🇧","🅾","🅱","🇷","🇪","🇦","🇰"]
							for(var x = 0; x<unicodes.length;x++){
								await value.react(unicodes[x]).then()
								.catch();
							}
						}).catch(console.error);						
					}else if(react_id !== ""){
						global_params.message.delete(0)
							.then(async function(msg){
								global_params.logger.info("Deleted message from "+msg.author.username+":"+global_params.message.id+" after issuing react command requesting for "+react_id);	
								await value.react(global_params.client.emojis.get(react_id)).then(function(){
								}).catch(console.error);			
							}) 
							.catch(console.error);
					}	

				}
			});
		})
		.catch(console.error);		
	}else if(message_type.command_name === "reactto"){

	}
}
