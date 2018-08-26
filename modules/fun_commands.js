/*fun commands*/
module.exports = {
	check_names:function(command_name){
		/*var module_names = ["shoot","bomb"];*/
		var module_names = ["bomb","release","kidnap"];
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
		global_params.message.delete(0).then(function(msg){
			msg.channel.send("command is under construction");
		});
	},
	kidnap:function(global_params,global_settings,message_type){
		global_params.message.delete(0).then(function(msg){
			msg.channel.send("command is under construction");
		});
	}
}