/*set auto response*/
function send_success(message,command_name,setting_name,prev_val,new_val){
	if(prev_val !== new_val){
		message.channel.send("",{		
			embed:{
				color: 7165476,
				title:"Settings have been updated for *"+setting_name+"*",
				fields:[{
					name:"Old value",
					value:prev_val,
					inline:"true"
				},{
					name:"New Value",
					value:new_val,
					inline:"true"
				}]
			}
		});
	}else{
		message.channel.send("*"+setting_name+"* is already "+command_name+"d.");
	}
};

module.exports = (global_params,global_settings,message_type) => {
	let Discord = global_params.discord;
	var old_val;
	if(global_params.message.author.id === global_params.config.owner_id){
		if(message_type.command_name === "disable"){
			var setting = message_type.parameters[0]+""; 
			if(setting.toLowerCase() === "bff"){
				old_val = JSON.parse(global_settings.bff);
				global_settings.bff = false;
				send_success(global_params.message,message_type.command_name,setting.toLowerCase(),old_val,global_settings.bff);
			}else if(setting.toLowerCase() === "f2p"){
				old_val = JSON.parse(global_settings.f2p);
				global_settings.f2p = false;
				send_success(global_params.message,message_type.command_name,setting.toLowerCase(),old_val,global_settings.f2p);
			}else if(setting.toLowerCase() === "gei"){
				old_val = JSON.parse(global_settings.gei);
				global_settings.gei = false;
				send_success(global_params.message,message_type.command_name,setting.toLowerCase(),old_val,global_settings.gei);
			}else{
				global_params.message.channel.send("<@"+global_params.message.author.id+">, no settings found for that keyword.");
			}
		}else if(message_type.command_name === "enable"){
			var setting = message_type.parameters[0]+""; 
			if(setting.toLowerCase() === "bff"){
				old_val = JSON.parse(global_settings.bff);
				global_settings.bff = true;
				send_success(global_params.message,message_type.command_name,setting.toLowerCase(),old_val,global_settings.bff);
			}else if(setting.toLowerCase() === "f2p"){
				old_val = JSON.parse(global_settings.f2p);
				global_settings.f2p = true;
				send_success(global_params.message,message_type.command_name,setting.toLowerCase(),old_val,global_settings.f2p);
			}else if(setting.toLowerCase() === "gei"){
				old_val = JSON.parse(global_settings.gei);
				global_settings.gei = true;
				send_success(global_params.message,message_type.command_name,setting.toLowerCase(),old_val,global_settings.gei);
			}else{
				global_params.message.channel.send("<@"+global_params.message.author.id+">, no settings found for that keyword.");
			}
		}
		
	}else{
		global_params.message.channel.send("Sorry <@"+global_params.message.author.id+"> but only bot owner can access this command.");
	}

}