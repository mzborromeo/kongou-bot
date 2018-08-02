/*special case processor*/
module.exports = (discord,message,config,client,logger,message_type) => {
	let Discord = discord;
	if(message.author.id === "232221425329504257"){
		/*emi case 232221425329504257 */
		try{
			/*logger.debug("user matched");*/
			var triggered = false;
			var message_content = ""+message.content;
			message_content = message_content.toLowerCase();
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
				message_content.includes("f2play") ){
				/*logger.debug("statement match trying to react");*/
				(async function(msg){
									var unicodes = ["🐳","🐋","🐙","🦑","🇼","🇭","🇦","🇱","🇪"];
									for(var x = 0; x<unicodes.length;x++){
										await msg.react(unicodes[x]).then(/*msge => logger.debug("react success")*/)
										.catch(/*msge => logger.debug("react failed")*/);
									}
								})(message);
				triggered = true;
			}else if(message_content.includes("don't spend") || message_content.includes("didn't spend")){
				message.channel.send("You mean whale hard?");
				triggered = true;
			}else if(message_content.includes("0 benefits")){
				message.channel.send("*0 benefits*?Aren't you a mihoho share holder already?");
				triggered = true;
			}
			if(triggered === true){
				message.guild.members.get("232221425329504257").setNickname("Galactic Whale btw");
			}
		}catch(err){
			/*logger.error(err);*/
		}
	}
}
