/*list command*/
/*message processor*/
var embed_fields_proc = function(emote_arr,page_num){
	var embed_fields = [];
	if(emote_arr[page_num] !== undefined){
		emote_arr[page_num].forEach(function(value){
			let animated_string = (value.animated === true)?"a":"";
			embed_fields.push({name:"*"+value.id+"*",value:"emote: <"+animated_string+":"+value.name+":"+value.id+">\n"+"name: "+value.name,inline:"true"});	
		});
	}
	return embed_fields;
};

var edit_message =  function(message,field_list){
	var is_next = false;
	message.edit({embed:{
			color: 7165476,
			title: "Emote List",
			fields:field_list
		}
	}).then().catch(function(err){
	});
	return;
};

var manage_react = async function(msg,page_switch_buttons){
	for(let x = 0;x<page_switch_buttons.length;x++){
		await msg.react(page_switch_buttons[x]).then().catch();
	}
	return;
};

var send_empty_message = function(message){
	message.edit({embed:{
			color: 7165476,
			title: "Emote List",
			description:"Nothing on this page"
		}
	}).then().catch();
	return;
}

var send_message =  function(message,emote_list,field_list,page_switch_buttons,current_page){
	var is_next = false;
	message.channel.send({embed:{
			color: 7165476,
			title: "Emote List",
			fields:field_list
		}
	}).then(function(msg){
		manage_react(msg,page_switch_buttons);
		const filter = (reaction, user) => user.id === message.author.id;
		const collector = msg.createReactionCollector(filter, { time: 40000 });
		collector.on('collect', function(r){
			if(r.emoji.name === page_switch_buttons[0]){
				current_page+= -1;
				var field_list = embed_fields_proc(emote_list,current_page);
				if(field_list.length === 0){
					send_empty_message(msg);
					msg.clearReactions().then(function(){
						manage_react(msg,page_switch_buttons);
					}).catch();										
				}else{
					edit_message(msg,field_list);				
					msg.clearReactions().then(function(){
						manage_react(msg,page_switch_buttons);
					}).catch();					
				}

			}else if(r.emoji.name === page_switch_buttons[1]){
				current_page+= 1;
				var field_list = embed_fields_proc(emote_list,current_page);
				if(field_list.length === 0){
					send_empty_message(msg);
					msg.clearReactions().then(function(){
						manage_react(msg,page_switch_buttons);
					}).catch();			
				}else{
					edit_message(msg,field_list);				
					msg.clearReactions().then(function(){
						manage_react(msg,page_switch_buttons);
					}).catch();
				}
			}		
		});
		collector.on('end', function(collected){
			msg.clearReactions().then().catch();
		});		
	}).catch();
	return;
};


function listServers(global_params,message_type){
	try{
		var server_list = [];
		var embed_message = new global_params.discord.RichEmbed();
		global_params.client.guilds.forEach(function(value, key, map){
			if(value.id !== "410450878714347521"){/*skip test server*/
				server_list.push({name:"*"+value.name+"*",value:value.id,inline:"false"});	
			}		
		}); 	
		global_params.message.channel.send({embed:{
				color: 7165476,
				title: "List of servers I'm currenty joined",
				fields:server_list
			}
		}).then().catch();
	}catch(err){
		global_params.logger.error(err);
	}	
}

var EmoteFilters = {
	ANIMATED:"animated",
	STATIC:"static",
	ALL:"all"
}

function listAllEmotes(global_params,msg,message_type,filter){
	var last_message_id = undefined;
	var page_switch_buttons = ["◀","▶"];
	var emote_list = {};
	global_params.message.channel.fetchMessages({ limit: 1})
	.then(function(messages){
		messages.forEach(function(value,key,map){
			if(value.id !== msg.id){
				last_message_id = value.id;
				global_params.logger.debug("last message id was "+last_message_id);
				const emoji_list = global_params.client.emojis;
/*				var react_id = "";
				var emote_name = message_type.parameters[0];*/
				var content_index = 1;
				var page_num = 1;
				
				var content = [];
				var filtered_out = true;
				emoji_list.forEach(function(value,key,map){
					if(filter === EmoteFilters.ANIMATED && value.animated === true){
						filtered_out = false;
					}else if(filter === EmoteFilters.STATIC && value.animated === false){
						filtered_out = false;
					}else if(filter === EmoteFilters.ALL){
						filtered_out = false;
					}else{
						filtered_out = true;
					}
					global_params.logger.debug(filtered_out);
					if(filtered_out !== true){
						content.push({id:value.id,name: value.name,animated:value.animated});
						content_index++
						if(content_index > 25){
							emote_list[page_num] = JSON.parse(JSON.stringify(content));
							page_num++;
							content.length = 0;
							content_index = 1;
						}
					}
				});	
				global_params.logger.debug(emote_list[1]);
			}
		});
		var current_page = 1;
		var field_list = embed_fields_proc(emote_list,current_page);
		send_message(msg,emote_list,field_list,page_switch_buttons,current_page);
	})
	.catch();	
}

function listEmoteDetail(global_params,msg,message_type,is_short_mode){
	var last_message_id = undefined;
	var emote_list = {};
	var embed_fields =[];
	global_params.message.channel.fetchMessages({ limit: 1}).then(function(messages){
		messages.forEach(function(value,key,map){
			if(value.id !== msg.id){								
				last_message_id = value.id;
				global_params.logger.debug("last message id was "+last_message_id);
				const emoji_list = global_params.client.emojis;
				emoji_list.forEach(function(value,key,map){
					global_params.logger.debug(value.name);
					if((value.name ===  message_type.parameters[1] && is_short_mode === false) || (value.name ===  message_type.parameters[0] && is_short_mode === true)){
						let animated_string = (value.animated === true)?"a":"";
						embed_fields.push({name:"*"+value.id+"*",value:"emote: <"+animated_string+":"+value.name+":"+value.id+">\n"+"name: "+value.name,inline:"true"});
					}
				});
			}
		});
		msg.channel.send({embed:{
				color: 7165476,
				title: "Emote Details",
				fields:embed_fields
			}
		}).then(function(){

		}).catch(function(){

		});					
	}).catch(function(){

	});
}


function listEmotesAt(global_params,msg,message_type,filter,is_short_mode){
	var last_message_id = undefined;
	var page_switch_buttons = ["◀","▶"];
	var emote_list = {};
	global_params.message.channel.fetchMessages({ limit: 1})
	.then(function(messages){
		messages.forEach(function(value,key,map){
			if(value.id !== msg.id){
				last_message_id = value.id;
				/*global_params.logger.debug("last message id was "+last_message_id);*/
				const emoji_list = global_params.client.emojis;
				var react_id = "";
				var guild_name = "";
				var init_x = (is_short_mode === true)?0:1;
				for(x = init_x;x<message_type.parameters.length;x++){
					guild_name+= message_type.parameters[x]+" ";
				}
				var content_index = 1;
				var page_num = 1;
				var content = [];
				var filtered_out = true;
				emoji_list.forEach(function(value,key,map){
					var value_guild_name = value.guild.name+"";
					if(filter === EmoteFilters.ANIMATED && value.animated === true){
						filtered_out = false;
					}else if(filter === EmoteFilters.STATIC && value.animated === false){
						filtered_out = false;
					}else if(filter === EmoteFilters.ALL){
						filtered_out = false;
					}else{
						filtered_out = true;
					}					
					if(filtered_out !== true){
						if((value.guild.id === message_type.parameters[(is_short_mode === true)?0:1]) || (value_guild_name.toLowerCase().trim() === guild_name.toLowerCase().trim())){
							global_params.logger.debug("content added");
							content.push({id:value.id,name: value.name,animated:value.animated});
							content_index++
							if(content_index > 25){
								emote_list[page_num] = JSON.parse(JSON.stringify(content));
								page_num++;
								content.length = 0;
								content_index = 1;
							}
						}
					}
				});	
				global_params.logger.debug(emote_list);
			}
		});
		var current_page = 1;
		var field_list = embed_fields_proc(emote_list,current_page);
		send_message(msg,emote_list,field_list,page_switch_buttons,current_page);
	})
	.catch();	
}

module.exports = (global_params,message_type) => {
	if(message_type.command_name === "list"){
		global_params.message.delete(0).then(function(msg){
			if(message_type.parameters[0] === "server"){
				listServers(global_params,message_type);
			}else if(message_type.parameters[0] === "emotes" && message_type.parameters.length === 1){
				listAllEmotes(global_params,msg,message_type,EmoteFilters.ALL);	
			}else if(message_type.parameters[0] === "emotes" && message_type.parameters[1] === "animated"){
				listAllEmotes(global_params,msg,message_type,EmoteFilters.ANIMATED);	
			}else if(message_type.parameters[0] === "emotes" && message_type.parameters[1] === "static"){
				listAllEmotes(global_params,msg,message_type,EmoteFilters.STATIC);	
			}else if(message_type.parameters[0] === "emotedetail"){
				listEmoteDetail(global_params,msg,message_type,false);
			}else if(message_type.parameters[0] === "emotesat"){
				listEmotesAt(global_params,msg,message_type,EmoteFilters.ALL,false);
			}else if(message_type.parameters[0] === "animatedemotesat"){
				listEmotesAt(global_params,msg,message_type,EmoteFilters.ANIMATED,false);
			}else if(message_type.parameters[0] === "staticemotesat"){
				listEmotesAt(global_params,msg,message_type,EmoteFilters.STATIC,false);
			}else if(message_type.parameters[0] === "duplicates"){
				/*list all of duplicate emotes*/
			}
		}).catch();
	}else if(message_type.command_name === "ls"){/*list server*/
		global_params.message.delete(0).then(function(msg){	
			listServers(global_params,message_type);
		}).catch(function(err){
			global_params.logger.error(err);
		});	
	}else if(message_type.command_name === "lae"){/*list all emote*/
		global_params.message.delete(0).then(function(msg){	
			listAllEmotes(global_params,msg,message_type,EmoteFilters.ALL);	
		}).catch(function(err){
			global_params.logger.error(err);
		});			
	}else if(message_type.command_name === "laae"){/*list all animated emotes*/
		global_params.message.delete(0).then(function(msg){	
			listAllEmotes(global_params,msg,message_type,EmoteFilters.ANIMATED);			
		}).catch(function(err){
			global_params.logger.error(err);
		});			
	}else if(message_type.command_name === "lase"){/*list all static emotes*/
		global_params.message.delete(0).then(function(msg){	
			listAllEmotes(global_params,msg,message_type,EmoteFilters.STATIC);			
		}).catch(function(err){
			global_params.logger.error(err);
		});			
	}else if(message_type.command_name === "laeas"){/*list all emotes at server*/
		global_params.message.delete(0).then(function(msg){	
			listEmotesAt(global_params,msg,message_type,EmoteFilters.ALL,true);
		}).catch(function(err){
			global_params.logger.error(err);
		});			
	}else if(message_type.command_name === "laseas"){/*list all static emotes at server*/
		global_params.message.delete(0).then(function(msg){	
			listEmotesAt(global_params,msg,message_type,EmoteFilters.STATIC,true);
		}).catch(function(err){
			global_params.logger.error(err);
		});			
	}else if(message_type.command_name === "laaeas"){/*list all animated emotes at server*/
		global_params.message.delete(0).then(function(msg){	
			listEmotesAt(global_params,msg,message_type,EmoteFilters.ANIMATED,true);
		}).catch(function(err){
			global_params.logger.error(err);
		});			
	}else if(message_type.command_name === "led"){/*list emote details*/
		global_params.message.delete(0).then(function(msg){	
			listEmoteDetail(global_params,msg,message_type,true);
		}).catch(function(err){
			global_params.logger.error(err);
		});		
	}
}
