/*administration*/
module.exports = {
	check_names:function(command_name){
		/*var module_names = ["shoot","bomb"];*/
		var module_names = ["mnd","unp","smr"];
		var name_validation = {has_match:false,matching_name:""};
		if(module_names.indexOf(command_name) > -1){
			name_validation = {has_match:true,matching_name:command_name};
		}
		return name_validation;
	},
	mnd:function(global_params,global_settings,message_type){
		global_params.message.delete(0).then(function(msg){
			var mentioned_count = msg.mentions.members.size;
			if(mentioned_count === 1){
				var mentioned_user = "";
				var nickname = msg.guild.members.get(msg.author.id).nickname;
				var final_user = (nickname === "" || nickname === undefined || nickname === null)?msg.author.username:nickname;
				msg.mentions.members.forEach(function(value,key,map){
					mentioned_user = value.id;
				});
				if(msg.guild.members.get(msg.author.id).hasPermission(['ADMINISTRATOR']) === false){
					msg.channel.send("You don't have admin rights to access that command");
				}else if(mentioned_user === global_params.client.user.id){
					msg.channel.send("If I mute and demote myself then how will I respond to your commands?");
				}else if(mentioned_user === global_params.env_vars.OWNER_ID){
					msg.channel.send("I cannot do that to my master. Try someone else.");
				}else{
					var roleslist = [];
					var mute_roles = [];
					msg.guild.roles.forEach(function(value,key,map){
						if(value.name.toLowerCase() === "nadeko-mute"){
							mute_roles.push(value.id);
							global_params.logger.debug("mute role: "+value.id+" : "+value.name);
						}
					});
					msg.mentions.members.get(mentioned_user).roles.forEach(function(value,key,map){
						if(value.name.toLowerCase() !== "@everyone"){	
							roleslist.push(value.id);
							global_params.pool.connect()
							  .then(client => {
							  	var query = "INSERT INTO guild_user_role_history(guild_id, member_id, role_id) VALUES ("+msg.guild.id+","+mentioned_user+","+value.id+");";
							  	global_params.logger.debug(query);
							    return client.query(query)
							      .then(res => {
							        client.release();
							      })
							      .catch(e => {
							        client.release();
							        global_params.logger.error(e.stack);
							      })
							  });
						}										
					});

					if(mute_roles.length === 0){
						msg.channel.send("Mute role not found");
					}else{
							var member_nickname = msg.guild.members.get(mentioned_user).nickname;
							var member_final_user = (member_nickname === "" ||
							 member_nickname === undefined || 
							 member_nickname === null)?msg.guild.members.get(mentioned_user).user.username:member_nickname;							
							msg.mentions.members.get(mentioned_user).setRoles(mute_roles).then(function(){
								global_params.logger.debug("Added roles: "+mute_roles);
								msg.channel.send(final_user+", "+member_final_user+" is now muted");
							}).catch(function(err){
								global_params.logger.error(err);
							});								
						
							 
					}	

				}				
			}else if(mentioned_count > 1){
				msg.channel.send("<@"+msg.author.id+">, cannot process multiple users atm. Wait for future release.");
			}else if(mentioned_count <= 0 ){
				msg.channel.send("<@"+msg.author.id+">, no mentioned member");
			}			

		}).catch(function(err){
			global_params.logger.error(err);
		});
	},
	unp:function(global_params,global_settings,message_type){
		global_params.message.delete(0).then(function(msg){
			var mentioned_count = msg.mentions.members.size;
			if(mentioned_count === 1){
				var mentioned_user = "";
				var nickname = msg.guild.members.get(msg.author.id).nickname;
				var final_user = (nickname === "" || nickname === undefined || nickname === null)?msg.author.username:nickname;
				msg.mentions.members.forEach(function(value,key,map){
					mentioned_user = value.id;
				});

				if(msg.guild.members.get(msg.author.id).hasPermission(['ADMINISTRATOR']) === false){
					msg.channel.send("You don't have admin rights to access that command");
				}else if(mentioned_user === global_params.client.user.id){
					msg.channel.send("You do realize that I can't mute myself right?");
				}else if(mentioned_user === global_params.env_vars.OWNER_ID){
					msg.channel.send("No need for that. I won't even bother muting and demoting him.");
				}else{
					var roleslist = [];
					global_params.pool.connect()
					  .then(client => {
					  	var query = "SELECT unmute_restore("+msg.guild.id+","+mentioned_user+") AS role_id;";
					  	global_params.logger.debug(query);
					    return client.query(query)
					      .then(res => {
					        client.release();
					        if(res.rowCount > 0){
								for(var i = 0; i < res.rowCount; i++){
									roleslist.push(res.rows[i].role_id.toString().replace("(","").replace(")",""));
								}	
								var member_nickname = msg.guild.members.get(mentioned_user).nickname;
								var member_final_user = (member_nickname === "" ||
								member_nickname === undefined || 
								member_nickname === null)?msg.guild.members.get(mentioned_user).user.username:member_nickname;							
								msg.mentions.members.get(mentioned_user).setRoles(roleslist).then(function(){
									global_params.logger.debug("Added roles: "+roleslist);
									msg.channel.send(final_user+", "+member_final_user+" is now unmuted");
								}).catch(function(err){
									global_params.logger.error(err);
								});		
					        }
					      })
					      .catch(e => {
					        client.release();
					        global_params.logger.error(e.stack);
					      })
					  });						
				}				
			}else if(mentioned_count > 1){
				msg.channel.send("<@"+msg.author.id+">, cannot process multiple users atm. Wait for future release.");
			}else if(mentioned_count <= 0 ){
				msg.channel.send("<@"+msg.author.id+">, no mentioned member");
			}			

		}).catch(function(err){
			global_params.logger.error(err);
		});
	}

}