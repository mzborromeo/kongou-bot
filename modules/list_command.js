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
	/*console.log(message);*/
	var is_next = false;
	message.edit({embed:{
			color: 7165476,
			title: "Emote List",
			fields:field_list
		}
	}).then().catch(function(err){
		/*console.log(err);*/
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
				/*console.log(field_list.length);*/
				edit_message(msg,field_list);				
				msg.clearReactions().then(function(){
					manage_react(msg,page_switch_buttons);
				}).catch();
			}else if(r.emoji.name === page_switch_buttons[1]){
				current_page+= 1;
				var field_list = embed_fields_proc(emote_list,current_page);
				/*console.log(field_list.length);*/
				edit_message(msg,field_list);				
				msg.clearReactions().then(function(){
					manage_react(msg,page_switch_buttons);
				}).catch();
			}		
		});
		collector.on('end', function(collected){
			/*console.log("pagination end");*/
			msg.clearReactions().then().catch();
		});		
	}).catch();
	return;
};

module.exports = (discord,message,config,client,logger,message_type) => {
	let Discord = discord;
	if(message_type.command_name === "list"){
		if(message_type.parameters[0] === "server"){
			try{
				var server_list = [];
				var embed_message = new Discord.RichEmbed();
				client.guilds.forEach(function(value, key, map){
					if(value.id !== "410450878714347521"){/*skip test server*/
						server_list.push({name:"*"+value.name+"*",value:value.id,inline:"false"});	
					}		
				}); 	
				message.channel.send({embed:{
						color: 7165476,
						title: "List of servers I'm currenty joined",
						fields:server_list
					}
				}).then().catch();
			}catch(err){
				/*logger.error(err);*/
			}
		}else if(message_type.parameters[0] === "emotes"){
				var last_message_id = undefined;
				var page_switch_buttons = ["◀","▶"];
				var emote_list = {};
				message.channel.fetchMessages({ limit: 2})
				.then(function(messages){
					messages.forEach(function(value,key,map){
						if(value.id !== message.id){
							last_message_id = value.id;
							logger.debug("last message id was "+last_message_id);
							const emoji_list = client.emojis;
							var react_id = "";
							var emote_name = message_type.parameters[0];
							var content_index = 1;
							var page_num = 1;
							
							var content = [];
							emoji_list.forEach(function(value,key,map){
								/*logger.debug("id: "+value.id+" index: "+content_index+" page: "+page_num);*/
								content.push({id:value.id,name: value.name,animated:value.animated});
								content_index++
								if(content_index > 25){
									emote_list[page_num] = JSON.parse(JSON.stringify(content));
									page_num++;
									content.length = 0;
									content_index = 1;
								}
							});	
							/*logger.debug(emote_list[1]);*/
						}
					});
					var current_page = 1;
					var field_list = embed_fields_proc(emote_list,current_page);
					send_message(message,emote_list,field_list,page_switch_buttons,current_page);
				})
				.catch();		
		}else if(message_type.parameters[0] === "emotesat"){
			/*list all of emotes on a given server*/
		}else if(message_type.parameters[0] === "duplicates"){
			/*list all of duplicate emotes*/
		}
	}
}
