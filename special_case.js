/*special case processor*/
module.exports = (discord,message,config,client,logger,message_type) => {
	let Discord = discord;
	if(message.author.id === "232221425329504257"){
		/*emi case 232221425329504257 */
		try{
			/*logger.debug("user matched");*/
			var message_content = ""+message.content;
			message_content = message_content.toLowerCase();
			if(message_content.includes("emi is f2p") || message_content.includes("i'm f2p") || message_content.includes("me f2p") || message_content.includes("iam f2p") || message_content.includes("emi is a f2p") || message_content.includes("emi f2p")){
				/*logger.debug("statement match trying to react");*/
				(async function(msg){
									var unicodes = ["🐳","🐋","🐙","🦑"];
									for(var x = 0; x<unicodes.length;x++){
										await msg.react(unicodes[x]).then(/*msge => logger.debug("react success")*/)
										.catch(/*msge => logger.debug("react failed")*/);
									}
								})(message);
			}
		}catch(err){
			/*logger.error(err);*/
		}
	}
}
