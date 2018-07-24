/*list command*/
/*message processor*/
module.exports = (discord,message,config,client,logger,message_type) => {
	let Discord = discord;
	if(message_type.command_name === "list"){
		if(message_type.parameters[0] === "server"){
			try{
				var server_list = [];
				var embed_message = new Discord.RichEmbed();
				client.guilds.forEach(function(value, key, map){
					if(value.id !== "410450878714347521"){
						server_list.push({name:"*"+value.name+"*",value:value.id,inline:"false"});	
					}		
				}); 	
				message.channel.send({embed:{
						color: 7165476,
						title: "List of servers I'm currenty joined",
						fields:server_list
					}
				});
			}catch(err){
				/*logger.error(err);*/
			}
		}else if(message_type.parameters[0] === "emotes"){
			/*list all of emotes on joined servers*/
		}else if(message_type.parameters[0] === "emotesat"){
			/*list all of emotes on a given server*/
		}else if(message_type.parameters[0] === "duplicates"){
			/*list all of duplicate emotes*/
		}
	}
}