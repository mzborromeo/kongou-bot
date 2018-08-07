/*rename command*/
module.exports = (discord,message,config,client,logger,message_type) => {
	let Discord = discord;
	if(message_type.command_name === "renameemote" && message.guild.id !== "392004770228862977"){
		var emote_id = message_type.parameters[0];
		var new_emote_name = message_type.parameters[1]; 
		try{
			const emoji_list = client.emojis;
			emoji_list.forEach(function(value,key,map){
				if(emote_id === value.id){
					value.setName(new_emote_name).then(function(){
						message.channel.send("Emote successfully renamed");
					}).catch(/*message.channel.send("Error setting new emote name")*/);
					
				}
			});
		}catch(err){
			logger.error(err);
		}
	}
}