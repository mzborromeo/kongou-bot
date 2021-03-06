/*module redirector*/
module.exports = (global_params,global_settings,message_type) => {
	if(message_type === undefined){/*ignore non command or emote request*/
		return;
	}
	var fun_command_processor = require("./fun_commands.js");
	var admin_command_processor = require("./admin_commands.js");
	if(message_type.command_type === "command"){
		if(message_type.command_name === "list" ||
			message_type.command_name === "ls" ||
			message_type.command_name === "lae" ||
			message_type.command_name === "laae" ||
			message_type.command_name === "lase" ||
			message_type.command_name === "laeas" ||
			message_type.command_name === "laseas" ||
			message_type.command_name === "laaeas" ||
			message_type.command_name === "led"){
			let list_processor = require("./list_command.js");
			let list_invoker = list_processor(global_params,global_settings,message_type);
		}else if(message_type.command_name === "react" || message_type.command_name === "reactto"){/*for adding reactions on channels last visible message*/
			let react_processor = require("./react_command.js");
			let react_invoker = react_processor(global_params,global_settings,message_type);
		}else if(message_type.command_name === "send"){/*for send modules*/

		}else if(message_type.command_name === "link" ||
			message_type.command_name === "le"){/*for adding reactions to message outside of channel*/
			let link_processor = require("./link_command.js");
			let link_invoker = link_processor(global_params,global_settings,message_type);			
		}else if(message_type.command_name === "renameemote"){
			let rename_processor = require("./rename_command.js");
			let rename_invoker = rename_processor(global_params,global_settings,message_type);						
		}else if(message_type.command_name === "disable" || message_type.command_name === "enable"){
			let auto_processor = require("./set_auto.js");
			let auto_invoker = auto_processor(global_params,global_settings,message_type);						
		}else if(message_type.command_name === "gsearch" ||
			message_type.command_name === "gtis" ||
			message_type.command_name === "gris"){
			let gsearch_processor = require("./google_search_command.js");
			let gsearch_invoker = gsearch_processor(global_params,global_settings,message_type);						
		}else if(fun_command_processor.check_names(message_type.command_name).has_match ===true){
			let command_invoker = fun_command_processor[fun_command_processor.check_names(message_type.command_name).matching_name](global_params,global_settings,message_type);
		}else if(admin_command_processor.check_names(message_type.command_name).has_match ===true){
			let command_invoker = admin_command_processor[admin_command_processor.check_names(message_type.command_name).matching_name](global_params,global_settings,message_type);
		}
	}else if(message_type.command_type === "emoji_request"){
		var x = 0;
			global_params.logger.info(message_type.emoji_names+" was requested");
			try{
				var emoji_message = "";	
				for(x = 0;x<message_type.emoji_names.length;x++){
					var emote_name = message_type.emoji_names;
					const emoji_list = global_params.client.emojis;
					emoji_list.forEach(function(value,key,map){
						if(emote_name[x] === value.name){
							let animated_string = (value.animated === true)?"a":"";
							emoji_message += "<"+animated_string+":"+value.name+":"+value.id+"> ";
							/*emoji_message = value.url;*/
						}
					});
				}
				if(emoji_message !== "") {
						global_params.message.delete(0)
							.then(function(msg){
								global_params.logger.info("Deleted message from "+msg.author.username+":"+global_params.message.id+" after requesting for emote");	
							}) 
							.catch(console.error);				
					var nickname = global_params.message.guild.members.get(global_params.message.author.id).nickname;
					var final_user = (nickname === "" || nickname === undefined || nickname === null)?global_params.message.author.username:nickname;
					global_params.message.channel.send(emoji_message,{
						embed:{
							color: 7165476,
							author:{
								name:final_user,
								icon_url:global_params.message.author.displayAvatarURL
							},
							timestamp:new Date()
						}
					});					
				}
			}catch(err){
				global_params.logger.error(err);
			}	
	}else if(message_type.command_type === "special_case"){
			let special_processor = require("./special_case.js");
			let special_invoker = special_processor(global_params,global_settings,message_type);		
	}
}