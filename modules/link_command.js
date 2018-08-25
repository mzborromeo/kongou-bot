/*link command*/
module.exports = (global_params,global_settings,message_type) => {
	let Discord = global_params.discord;
	if(message_type.command_name === "link"){
		if(message_type.parameters[0] === "avatar"){
			/*sends link of user avatar*/

		}else if(message_type.parameters[0] === "emote"){
			var emote_name = message_type.parameters[1];
			global_params.logger.info(emote_name+" url was requested");
			try{
				const emoji_list = global_params.client.emojis;
				emoji_list.forEach(function(value,key,map){
					if(emote_name === value.name){
						global_params.message.channel.send("",{
							embed:{
								color:7165476,
								author:{
									name:value.name,
									url:value.url,
									icon_url:value.url
								},
								image:{
									url:value.url
								},
								footer:{
									text:value.guild.name,
									icon_url:value.guild.iconURL
								}
							}
						});
					}
				});
			}catch(err){
				global_params.logger.error(err);
			}				
		}
	}else if(message_type.command_name === "le"){
			var emote_name = message_type.parameters[0];
			global_params.logger.info(emote_name+" url was requested");
			try{
				const emoji_list = global_params.client.emojis;
				emoji_list.forEach(function(value,key,map){
					if(emote_name === value.name){
						global_params.message.channel.send("",{
							embed:{
								color:7165476,
								author:{
									name:value.name,
									url:value.url,
									icon_url:value.url
								},
								image:{
									url:value.url
								},
								footer:{
									text:value.guild.name,
									icon_url:value.guild.iconURL
								}
							}
						});
					}
				});
			}catch(err){
				global_params.logger.error(err);
			}	
	}
}