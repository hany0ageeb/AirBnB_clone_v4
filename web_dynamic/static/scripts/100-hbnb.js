$(function(){
	const amenities_ids = [];
	const amenities_names = [];
	const states_ids = [];
	const states_names = [];
	const cities_ids = [];
	const cities_names = [];
	const status_url = 'http://0.0.0.0:5001/api/v1/status/';
	const places_url = 'http://0.0.0.0:5001/api/v1/places_search/';
	$('ul#amenities-list input[type="checkbox"]').on('change', function(){
		if(this.checked) {
			amenities_ids.push($(this).attr('data-id'));
			amenities_names.push($(this).attr('data-name'));
		} else {
			amenities_ids.pop($(this).attr('data-id'));
			amenities_names.pop($(this).attr('data-name'));
		}
		$('.amenities>h4').html(amenities_names.join(', '));
	});
	$('ul#states-list input[type="checkbox"]').on('change', function(event){
		if(this.checked) {
			if (!states_ids.includes($(this).attr('data-id'))){
				states_ids.push($(this).attr('data-id'));
				states_names.push($(this).attr('data-name'));
			}
		} else {
			states_ids.pop($(this).attr('data-id'));
			states_names.pop($(this).attr('data-name'));
		}
		$('.locations>h4').empty();
		//$('.locations>h4').text(states_names.join(', ') + ", " +cities_names.join(', '));
	});
	$('ul#cities-list input[type=checkbox]').on('change', function(event){
		event.stopPropagation();
		if (this.checked) {
			const dataId = $(this).attr('data-id');
			if (!cities_ids.includes(dataId)){
				cities_ids.push(dataId);
				cities_names.push($(this).attr('data-name'));
			}
		} else {
			cities_ids.pop($(this).attr('data-id'));
			cities_names.pop($(this).attr('data-name'));
		}
		$('.locations>h4').empty();
		//$('.locations>h4').text(states_names.join(', ') + cities_names.join(', '));
	});
	$.get(status_url, (data) => {
		if (data.status === 'OK') {
			$('div#api_status').removeClass('unavailable');
			$('div#api_status').addClass('available');
			$('.locations>h4').empty();
			$('.locations>h4').text(states_names.join(', ') + cities_names.join(', '));
		} else {
			$('div#api_status').removeClass('available');
			$('div#api_status').addClass('unavailable');
		}
	});
	function addPlaces(places){
		places.forEach(place => {
			let article = jQuery('<article>');
			let h2 = jQuery('<h2>');
			h2.text(place.name);
			let div = jQuery('<div>');
			div.addClass("price_by_night");
			div.text(`$${place.price_by_night}`);
			article.append(h2);
			article.append(div);
			div = jQuery('<div>');
			div.addClass("information");
			let subDiv = jQuery('<div>');
			subDiv.addClass("max_guest");
			subDiv.text(`${place.max_guest} Guest(s)`);
			div.append(subDiv);
			subDiv = jQuery('<div>');
			subDiv.addClass("number_rooms");
			subDiv.text(`${place.number_rooms} Bedroom(s)`);
			div.append(subDiv);
			subDiv = jQuery('<div>');
			subDiv.addClass("number_bathrooms");
			subDiv.text(`${place.number_bathrooms} Bathroom(s)`);
			div.append(subDiv);
			article.append(div);
			div = jQuery('<div>');
			div.addClass("user");
			div.text(`${place.user.first_name} ${place.user.last_name}`);
			div.prepend('<b>Owner:</b> ');
			article.append(div);
			div= jQuery('<div>');
			div.addClass("description");
			let p = jQuery('<p>');
			p.text(`${place.description}`);
			div.append(p);
			article.append(div);
			if (place && place.amenities) {
				div = jQuery('<div>');
				div.addClass("amenities");
				div.append('<h2>Amenities</h2>');
				let ul = jQuery('<ul>');
				place.amenities.forEach((amenity) => {
					let li = jQuery('<li>');
					li.text(`${amenity.name}`);
					ul.append(li);
				});
				div.append(ul);
				if (place.reviews) {
					subDiv = jQuery('<div>');
					subDiv.addClass("reviews");
					subDiv.append(`<h2>${place.reviews.length} Reviews</h2>`);
					ul = jQuery('<ul>');
				
					place.reviews.forEach((review) => {
						let li = jQuery('<li>');
						let h3 = jQuery('<h3>');
						h3.text(`From ${review.user.first_name} ${review.user.last_name} ${(new Date(review.updated_at)).toDateString()}`);
						let p = jQuery('<p>');
						p.text(`${review.text}`);
						li.append(h3);
						li.append(p);
						ul.append(li);
					});
					subDiv.append(ul);
					div.append(subDiv);
				}
				article.append(div);
			}
			$('.places').append(article);
		});
	}
	$.ajax(places_url,{
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({}),
		success: function(data){
			addPlaces(data);
		},
	});
	$('button').click(function(){
		$.ajax(places_url,{
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				amenities: amenities_ids,
				states: states_ids,
				cities: cities_ids}),
			success: function(data){
				$('.places').empty();
				addPlaces(data);
			},
		});
	});
});