/*rename command*/
module.exports = (global_params,message_type) => {
	let Discord = global_params.discord;
	if(message_type.command_name === "renameemote" && global_params.message.guild.id !== "392004770228862977"){
		var emote_id = message_type.parameters[0];
		var new_emote_name = message_type.parameters[1]; 
		try{
			const emoji_list = global_params.client.emojis;
			emoji_list.forEach(function(value,key,map){
				if(emote_id === value.id){
					value.setName(new_emote_name).then(function(){
						global_params.message.channel.send("Emote successfully renamed");
					}).catch();
					
				}
			});
		}catch(err){
			global_params.logger.error(err);
		}
	}
}
