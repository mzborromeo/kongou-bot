/*send command*/
/*message processor*/
module.exports = (discord,message,config,client,logger,message_type) => {
	let Discord = discord;
	if(message_type.command_name === "send"){
		if(message_type.parameters[0] === "messageto"){
			/*sends message to specified user*/

		}
	}
}