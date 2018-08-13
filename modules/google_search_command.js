/*gsearch command*/
var run_search = async function(global_params,param_string,is_random){
	var res = await global_params.customsearch.cse.list({
		cx:global_params.env_vars.GOOGLE_IMAGE_SEARCH_ID,
		q: param_string,
		auth:global_params.env_vars.GOOGLE_API_KEY,
		num:10,
		searchType:"image"
	}).then(function(result){
		if(result.status === 200){
			var items = [];
			/*iterate items*/
			result.data.items.forEach(function(entry) {
			    items.push({display_link:entry.displayLink,link:entry.link,image_url:entry.image.thumbnailLink});
			});
			/*global_params.logger.debug(items);*/
			var chosen_entry;
			if(is_random === true){
				let rnd = Math.floor(Math.random() * ((items.length-1) - 0) + 0);
				chosen_entry = items[rnd];
			}else{
				chosen_entry =items[0];
			}
			global_params.message.channel.send("<@"+global_params.message.author.id+"> here's your image of **"+param_string+"** from",{embed:{
					color: 7165476,
					title: chosen_entry.display_link,
					url:chosen_entry.link,
					image:{
						url:chosen_entry.image_url
					}
				}
			}).then(function(msg){

			}).catch(function(err){
				global_params.logger.error(err)
			});
		}else{
			global_params.logger.debug(result.data);
		}
	}).catch(function(err){
		global_params.logger.error(err);
	});
};
module.exports = (global_params,message_type) => {
	let Discord = global_params.discord;
	if(message_type.command_name === "gsearch"){
		if(message_type.parameters[0] === "timg"){
			try{
				var param_string = "";
				for(var x=1;x<message_type.parameters.length;x++){
					param_string+=message_type.parameters[x]+" ";
				}
				global_params.logger.debug("searching image using keyword "+param_string);
				run_search(global_params,param_string,false);
			}catch(err){
				global_params.logger.debug(err);
			}
		}else if(message_type.parameters[0] === "rimg"){
			try{
				var param_string = "";
				for(var x=1;x<message_type.parameters.length;x++){
					param_string+=message_type.parameters[x]+" ";
				}
				global_params.logger.debug("searching image using keyword "+param_string);
				run_search(global_params,param_string,true);
			}catch(err){
				global_params.logger.debug(err);
			}
		}
	}
}
