/*module redirector*/
module.exports = (discord,message,config,client,logger,message_type) => {
	if(message_type === undefined){/*ignore non command or emote request*/
		return;
	}
	if(message_type.command_type === "command"){
		if(message_type.command_name === "list"){
			let list_processor = require("./list_command.js");
			let list_invoker = list_processor(discord,message,config,client,logger,message_type);
		}else if(message_type.command_name === "react"){/*for adding reactions on channels last visible message*/
			let react_processor = require("./react_command.js");
			let react_invoker = react_processor(discord,message,config,client,logger,message_type);
		}else if(message_type.command_name === "reactto"){/*for adding reactions to message outside of channel*/

		}else if(message_type.command_name === "send"){/*for send modules*/

		}else if(message_type.command_name === "link"){/*for adding reactions to message outside of channel*/
			let link_processor = require("./link_command.js");
			let link_invoker = link_processor(discord,message,config,client,logger,message_type);			
		}
	}else if(message_type.command_type === "emoji_request"){
		var x = 0;
			/*logger.info(message_type.emoji_names+" was requested");*/
			try{
				var emoji_message = "";	
				for(x = 0;x<message_type.emoji_names.length;x++){
					var emote_name = message_type.emoji_names;
					const emoji_list = client.emojis;
					emoji_list.forEach(function(value,key,map){
						if(emote_name[x] === value.name){
							let animated_string = (value.animated === true)?"a":"";
							emoji_message += "<"+animated_string+":"+value.name+":"+value.id+"> ";
							/*emoji_message = value.url;*/
						}
					});
				}
				if(emoji_message !== "") {
						message.delete(0)
							.then(function(msg){
								/*logger.info("Deleted message from "+msg.author.username+":"+message.id+" after requesting for emote");	*/
							}) 
							.catch(console.error);				
					var nickname = message.guild.members.get(message.author.id).nickname;
					var final_user = (nickname === "" || nickname === undefined || nickname === null)?message.author.username+"#"+message.author.discriminator:nickname;
					console.log(final_user);
					message.channel.send({
						embed:{
							color: 7165476,
							author:{
								name:final_user,
								icon_url:message.author.displayAvatarURL
							},
							description:emoji_message
						}
					});					

/*					message.channel.send({
						embed:{
							color: 7165476,
							author:{
								name:message.author.username+"#"+message.author.discriminator,
								icon_url:message.author.displayAvatarURL
							},
							image:{
								url:emoji_message
							}
						}
					});*/
				}
			}catch(err){
				/*logger.error(err);*/
			}	
	}else if(message_type.command_type === "special_case"){
			let special_processor = require("./special_case.js");
			let special_invoker = special_processor(discord,message,config,client,logger,message_type);		
	}
}
