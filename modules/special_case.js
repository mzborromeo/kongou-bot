/*special case processor*/
module.exports = (global_params,global_settings,message_type) => {
	let Discord = global_params.discord;
	var message_content = ""+global_params.message.content;
	message_content = message_content.toLowerCase();
	var channel_name = global_params.client.channels.get(global_params.message.channel.id).name+"";
	/*
		author id: 349399428810932234
		emi id: 232221425329504257
		yush id: 109385289813798912
		Arciel id: 151255303852261376
	*/
	if((message_content.includes("slap") || message_content.includes("punch")) && (message_content.includes("kirimaru")) || message_content.includes("<@"+global_params.env_vars.OWNER_ID+">")){
		//fetch messages sent by bot after this command
		global_params.message.channel.fetchMessages({limit:5,after:global_params.message.id}).then(messages => {
        	const botMessages = messages.filter(msg => msg.author.bot);
        	/*global_params.logger.debug(botMessages);*/
        	global_params.message.channel.bulkDelete(botMessages).then(function(messages){
        		var messagesDeleted = botMessages.array().length; 
        		global_params.message.channel.send("No one is allowed to slap or punch my mastah!!").then(function(){
	        		global_params.logger.debug("Reply success");	
	        	}).catch(function(){
	        		global_params.logger.debug("Failed to send message an error occured");	
	        	});
        		global_params.message.delete().then(function(message){
	        	}).catch(function(error){
	        		global_params.logger.debug(error);		
	        	});   
	        	console.log("deleted "+messagesDeleted+" messages");
        		global_params.logger.info("deleted "+messagesDeleted+" messages");     		
        	}).catch(function(error){
        		global_params.logger.debug(error);	
        	});
    	}).catch(function(error){
    		global_params.logger.debug(error);
    	});
	}else if(global_params.message.author.id === "232221425329504257" && global_settings.f2p === true){
		/*emi case 232221425329504257 */
		try{
			global_params.logger.debug("user matched");
			var triggered = false;
			if(message_content.includes("emi is f2p") || 
				message_content.includes("i'm f2p") || 
				message_content.includes("me f2p") || 
				message_content.includes("iam f2p") || 
				message_content.includes("emi is a f2p") ||
				message_content.includes("emi f2p") ||
				message_content.includes("emi is just a f2p") || 
				message_content.includes("f2p is emi") || 
				message_content.includes("emi's a f2p") || 
				message_content.includes("emi's just a f2p") ||
				message_content.includes("f2p") ||
				message_content.includes("free to play") ||
				message_content.includes("f2play") || 
				message_content.includes("not whale") ||
				message_content.includes("not a whale") ||
				message_content.includes("not wheel") ||
				message_content.includes("not a wheel")){
				global_params.logger.debug("statement match trying to react");
				(async function(msg){
									var unicodes = ["🐳","🐋","🐙","🦑","🇼","🇭","🇦","🇱","🇪"];
									for(var x = 0; x<unicodes.length;x++){
										await msg.react(unicodes[x]).then(msge => global_params.logger.debug("react success"))
										.catch(msge => global_params.logger.debug("react failed"));
									}
								})(global_params.message);
				triggered = true;
			}else if(message_content.includes("don't spend") || message_content.includes("didn't spend")){
				global_params.message.channel.send("You mean whale hard?");
				triggered = true;
			}else if(message_content.includes("0 benefits")){
				global_params.message.channel.send("*0 benefits*?Aren't you a mihoho share holder already?");
				triggered = true;
			}
			if(triggered === true){
				global_params.message.guild.members.get("232221425329504257").setNickname("Galactic Whale btw");
			}
		}catch(err){
			global_params.logger.error(err);
		}
	}else if(global_params.message.author.id === "109385289813798912" && message_content.match(/\<(a|):[A-Z|a-z]*:[0-9]{18}\>/g) && channel_name.includes("general") && global_settings.gei === true){
		(async function(msg){
							var unicodes = ["🇬","🇪","🇮"];
							for(var x = 0; x<unicodes.length;x++){
								await msg.react(unicodes[x]).then(msge => global_params.logger.debug("react success"))
								.catch(msge => global_params.logger.debug("react failed"));
							}
						})(global_params.message);
	}else if(message_content.includes("patchy is") && global_settings.bff === true){/*custom react test*/
		global_params.message.channel.send("Sarin's bff");
	}
}
