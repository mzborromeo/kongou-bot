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
				edit_message(msg,field_list);				
				msg.clearReactions().then(function(){
					manage_react(msg,page_switch_buttons);
				}).catch();
			}else if(r.emoji.name === page_switch_buttons[1]){
				current_page+= 1;
				var field_list = embed_fields_proc(emote_list,current_page);
				edit_message(msg,field_list);				
				msg.clearReactions().then(function(){
					manage_react(msg,page_switch_buttons);
				}).catch();
			}		
		});
		collector.on('end', function(collected){
			msg.clearReactions().then().catch();
		});		
	}).catch();
	return;
};

module.exports = (global_params,message_type) => {
	let Discord = global_params.discord;
	if(message_type.command_name === "list"){
		global_params.message.delete(0).then(function(msg){
			if(message_type.parameters[0] === "server"){
				try{
					var server_list = [];
					var embed_message = new Discord.RichEmbed();
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
			}else if(message_type.parameters[0] === "emotes"){
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
								var react_id = "";
								var emote_name = message_type.parameters[0];
								var content_index = 1;
								var page_num = 1;
								
								var content = [];
								emoji_list.forEach(function(value,key,map){
									/*global_params.logger.debug("id: "+value.id+" index: "+content_index+" page: "+page_num);*/
									content.push({id:value.id,name: value.name,animated:value.animated});
									content_index++
									if(content_index > 25){
										emote_list[page_num] = JSON.parse(JSON.stringify(content));
										page_num++;
										content.length = 0;
										content_index = 1;
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
			}else if(message_type.parameters[0] === "emotedetail"){
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
									if(value.name ===  message_type.parameters[1]){
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
			}else if(message_type.parameters[0] === "emotesat"){
				/*list all of emotes on a given server*/
			}else if(message_type.parameters[0] === "duplicates"){
				/*list all of duplicate emotes*/
			}
		}).catch();
	}
}
