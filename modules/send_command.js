/*send command*/
module.exports = (global_params,message_type) => {
	let Discord = global_params.discord;
	if(message_type.command_name === "send"){
		if(message_type.parameters[0] === "messageto"){
			/*sends message to specified user*/

		}
	}
}
