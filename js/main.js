	var templatesData = {
			allTemplates: []
		};
	var bool = true;
$(function() {

	$.getJSON('js/data.json',
			function(data) {

				$.each(data, function(index, value) {
					for (i = 0; i < value.length; i++) {
						templatesData.allTemplates.push({ 
							id : i,
							name : value[i].gamename,
							url : value[i].gameimage,
							pagelink : "gametemplate.html",
							
						});
						// console.log(value[i].flag);
					}
				});
			});
	
	setInterval(() => {
		if(bool){
	console.log(templatesData);
	var templateScript = $('#vonvon-template').html();
	var template = Handlebars.compile(templateScript);
	$(".gallery-post-grid.holder").append(template(templatesData));
	
	bool = false;
		}
		}, 100);
	
});