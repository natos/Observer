
$(function(){

	var url = 'http://tvgids.upc.nl/scheduleApi/api/Channel/7J%7C6s%7C7G%7C7K%7C7L/events/NowAndNext.json?optionalProperties=Channel.url%2CChannel.logoIMG%2CEvent.url&order=startDateTime&batchSize=2&batch=0&callback=?';

	$.getJSON( url , function(r) {

		var fragment = $('<ul>'), item;

		$(r).each(function(i, a) {
			$(a).each(function(i, e) {

				item = $('<li id="' + e.id + '">');
				item.append('<h3>' + e.programme.title + '</h3>');
				item.append('<p>' + e.programme.shortDescription + '</p>');

				fragment.append(item);
				
			});
		});

		$('#list').append(fragment);

	});

})
