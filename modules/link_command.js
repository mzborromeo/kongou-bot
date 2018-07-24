/*link command*/
/*message processor*/
module.exports = (discord,message,config,client,logger,message_type) => {
	let Discord = discord;
	if(message_type.command_name === "link"){
		if(message_type.parameters[0] === "avatar"){
			/*sends link of user avatar*/

		}else if(message_type.parameters[0] === "emote"){
			var emote_name = message_type.parameters[1];
			/*logger.info(emote_name+" url was requested");*/
			try{
				const emoji_list = client.emojis;
				emoji_list.forEach(function(value,key,map){
					if(emote_name === value.name){
						message.channel.send(value.url);
					}
				});
			}catch(err){
				/*logger.error(err);*/
			}				
		}
	}
}