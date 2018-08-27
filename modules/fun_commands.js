/*fun commands*/
module.exports = {
	check_names:function(command_name){
		/*var module_names = ["shoot","bomb"];*/
		var module_names = ["bomb","release","kidnap","clb"];
		var name_validation = {has_match:false,matching_name:""};
		if(module_names.indexOf(command_name) > -1){
			name_validation = {has_match:true,matching_name:command_name};
		}
		return name_validation;
	},
	shoot:function(global_params,global_settings,message_type){
		global_params.message.delete(0).then(function(msg){
			var mentioned_count = msg.mentions.members.size;
			if(mentioned_count === 1){

			}else if(mentioned_count > 1){
				msg.channel.send("<@"+msg.author.id+">, sorry you can't shoot "+mentioned_count+" users atm.");
			}else if(mentioned_count <= 0 ){
				msg.channel.send("<@"+msg.author.id+">, who should I shoot? You didn't mention anyone.");
			}			
			var mentioned_user = "";
			var mentioned_user_obj = {};
			var nickname = msg.guild.members.get(msg.author.id).nickname;
			var final_user = (nickname === "" || nickname === undefined || nickname === null)?msg.author.username+"#"+msg.author.discriminator:nickname;
			msg.mentions.members.forEach(function(value,key,map){
				mentioned_user = value.id;
				mentioned_user_obj = value.user;
			});
			msg.channel.send("Bang bang! <@"+msg.author.id+"> pulled the trigger",{embed:{
					color: 7165476,
					image:{
						url:"https://cdn.discordapp.com/emojis/479234817091960832.gif"
					},
					thumbnail:{
						url:mentioned_user_obj.displayAvatarURL
					}  
				}
			}).then(function(){

			}).catch(function(){

			});	
		}).catch(function(err){
			global_params.logger.error(err);
		});
	},
	bomb:function(global_params,global_settings,message_type){
		global_params.message.delete(0).then(function(msg){
			var mentioned_count = msg.mentions.members.size;
			var bomb_emotes = ["<:crybomb:471247517900734464>","<:bhbomb:471247517036576768>","<:crybomb:471247517900734464>","<:bhbomb:471247517036576768>","<:crybomb:471247517900734464>","<:bhbomb:471247517036576768>"];
			var random_index = Math.floor(Math.random() * ((bomb_emotes.length-1) - 0) + 0);
			if(mentioned_count === 1){
				var mentioned_user = "";
				msg.mentions.members.forEach(function(value,key,map){
					mentioned_user = value.id;
				});
				msg.channel.send({embed:{
						color: 7165476,
						author: {
							name:"Kaboom!",
							icon_url:"https://cdn.discordapp.com/emojis/479273053977837590.gif"
						},
						description:"<@"+msg.author.id+"> used a "+bomb_emotes[random_index]+" on <@"+mentioned_user+">. <@"+mentioned_user+"> was hurt physically and mentally."  
					}
				}).then(function(){

				}).catch(function(){

				});	
			}else if(mentioned_count > 1){
				var mentioned_user = "";
				msg.mentions.members.forEach(async function(value,key,map){
					mentioned_user = value.id;
					await msg.channel.send({embed:{
							color: 7165476,
							author: {
								name:"Kaboom!",
								icon_url:"https://cdn.discordapp.com/emojis/479273053977837590.gif"
							},
							description:"<@"+msg.author.id+"> used a "+bomb_emotes[random_index]+" on <@"+mentioned_user+">. <@"+mentioned_user+"> was hurt physically and mentally."  
						}
					}).then(function(){

					}).catch(function(){

					});						
				});
			}else if(mentioned_count <= 0 ){
				msg.channel.send("<@"+msg.author.id+">, who should I bomb? You didn't mentioned any member. Mentioning roles and channels won't work.");
			}	
		}).catch(function(err){
			global_params.logger.error(err);
		});
	},
	release:function(global_params,global_settings,message_type){
		var parse_attempt = false;
		parse_attempt = (isNaN(message_type.parameters[0]))?false:true;
		if(message_type.parameters[0] === "" || 
			message_type.parameters[0] === undefined ||
			message_type.parameters[0] === null){
			global_params.message.delete(0).then(function(msg){
				msg.channel.send("<@"+global_params.message.author.id+"> please provide number of loli to release.");
			}).catch(function(err){
				global_params.logger.error(err);
			});
		}else if(parse_attempt === false){
			global_params.message.delete(0).then(function(msg){
				msg.channel.send("<@"+global_params.message.author.id+"> you provided an invalid number.");
			}).catch(function(err){
				global_params.logger.error(err);
			});			
		}else{
			global_params.pool.connect()
			  .then(client => {
			  	var query = "SELECT release_loli("+global_params.message.guild.id+","+global_params.message.channel.id+","+message_type.parameters[0]+","+global_params.message.author.id+") AS ATTEMPT;";
			  	global_params.logger.debug(query);
			    return client.query(query)
			      .then(res => {
			        client.release();
			        var nickname = global_params.message.guild.members.get(global_params.message.author.id).nickname;
			        var username = global_params.message.guild.members.get(global_params.message.author.id).user.username;
			        var name_to_use = (nickname === null || nickname ==="" || nickname ===undefined)?username:nickname; 
			        var attempt_status = res.rows[0].attempt;
			        if(attempt_status === true){
						global_params.message.delete(0).then(function(msg){
							msg.channel.send(name_to_use+", released "+message_type.parameters[0]+" "+global_params.config.loli_currency+". Type *"+global_params.config.prefix+"kidnap* to kidnap.");
						}).catch(function(err){
							global_params.logger.error(err);
						});			        	
			        }else{
						global_params.message.delete(0).then(function(msg){
							msg.channel.send(name_to_use+", your "+global_params.config.loli_currency+" is not enough to do this.");
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
	},
	kidnap:function(global_params,global_settings,message_type){
		global_params.message.delete(0).then(function(msg){
			global_params.pool.connect()
			  .then(client => {
			  	var query = "SELECT kidnap_loli("+global_params.message.guild.id+","+global_params.message.channel.id+","+global_params.message.author.id+") AS kidnap_record;";
			  	global_params.logger.debug(query);
			    return client.query(query)
			      .then(res => {
			        client.release();
			        var nickname = global_params.message.guild.members.get(global_params.message.author.id).nickname;
			        var username = global_params.message.guild.members.get(global_params.message.author.id).user.username;
			        var name_to_use = (nickname === null || nickname ==="" || nickname ===undefined)?username:nickname; 
			        var kidnapping_record = res.rows[0].kidnap_record;	
			        var kidnapping_record_string = 	kidnapping_record.replace("(","");
			        kidnapping_record_string = kidnapping_record_string.replace(")","");	        
			        var kidnapping_record_columns = kidnapping_record_string.split(",");
			        /*global_params.logger.debug(kidnapping_record_columns[0]);*/
			        if(kidnapping_record_columns[0] === "t"){
						msg.channel.send(name_to_use+", kidnapped "+kidnapping_record_columns[1]+" "+global_params.config.loli_currency+". You now have "+kidnapping_record_columns[2]+" "+global_params.config.loli_currency);
			        }else{
						msg.channel.send(name_to_use+", sorry you were late. Someone already kidnapped the loli/s.");
			        }
			      })
			      .catch(e => {
			        client.release();
			        global_params.logger.error(e.stack);
			      })
			  });
		});
	},
	clb:function(global_params,global_settings,message_type){
		global_params.pool.connect()
		  .then(client => {
		    return client.query("SELECT check_balance("+global_params.message.author.id+") AS amount")
		      .then(res => {
		        client.release();
		        var nickname = global_params.message.guild.members.get(global_params.message.author.id).nickname;
		        var username = global_params.message.guild.members.get(global_params.message.author.id).user.username;
		        var name_to_use = (nickname === null || nickname ==="" || nickname ===undefined)?username:nickname; 
		        var amount = parseFloat(res.rows[0].amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").split(".")[0]
		        global_params.message.channel.send(name_to_use+", you currently have "+amount+" "+global_params.config.loli_currency);
		      })
		      .catch(e => {
		        client.release();
		        global_params.logger.error(err.stack)
		      })
		  });
	},
	daily:function(){

	},
}