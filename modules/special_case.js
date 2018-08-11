/*special case processor*/
module.exports = (global_params,message_type) => {
	let Discord = global_params.discord;
	var message_content = ""+global_params.message.content;
	message_content = message_content.toLowerCase();
	if(global_params.message.author.id === "232221425329504257"){
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
								})(message);
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
	}else if(message_content.includes("patchy is")){/*custom react test*/
		global_params.message.channel.send("Sarin's bff");
	}
}
