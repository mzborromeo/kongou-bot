/*set auto response*/
module.exports = (global_params,global_settings,message_type) => {
	let Discord = global_params.discord;
	if(global_params.message.author.id === global_params.env_vars.OWNER_ID){
		if(message_type.command_name === "disable"){
			var setting = message_type.parameters[0]+""; 
			if(setting.toLowerCase() === "bff"){
				global_settings.bff = false;
			}else if(setting.toLowerCase() === "f2p"){
				global_settings.f2p = false;
			}else if(setting.toLowerCase() === "gei"){
				global_settings.gei = false;
			}
		}else if(message_type.command_name === "enable"){
			var setting = message_type.parameters[0]+""; 
			if(setting.toLowerCase() === "bff"){
				global_settings.bff = true;
			}else if(setting.toLowerCase() === "f2p"){
				global_settings.f2p = true;
			}else if(setting.toLowerCase() === "gei"){
				global_settings.gei = true;
			}
		}
		global_params.message.channel.send("Settings have been updated");
	}else{
		global_params.message.channel.send("Sorry <@"+global_params.message.author.id+"> but only bot owner can access this command.");
	}

}
