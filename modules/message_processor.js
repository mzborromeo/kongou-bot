/*message processor*/
module.exports = (message,config,logger) => {
	if(message.content.startsWith(config.prefix) === true){
		let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  		let command = args.shift().toLowerCase();
  		let message_type = {command_type:"command",command_name:command,parameters:args};
		return message_type;
	}else if(message.content.startsWith("+") /*&& message.content.endsWith("+")*/){
		let emote_name = message.content.replace(/\+/g,"").split(" "); 
		let message_type = {command_type:"emoji_request",emoji_names:emote_name};
		return message_type;
	}
}