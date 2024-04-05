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
	$('ul#states-list input[type="checkbox"]').on('change', function(){
		if(this.checked) {
			states_ids.push($(this).attr('data-id'));
			states_names.push($(this).attr('data-name'));

		} else {
			states_ids.pop($(this).attr('data-id'));
			states_name.pop($(this).attr('data-name'));
		}
	});
	$('ul#cities-list input[type="checkbox"]').on('change', function(){
		if(this.checked) {
			cities_ids.push($(this).attr('data-id'));
			cities_names.push($(this).attr('data-name'));
		} else {
			cities_ids.pop($(this).attr('data-id'));
			cities_names.pop($(this).attr('data-name'));
		}
		$('.locations>h4').html(states_names.join(', '));
	});
	$.get(status_url, (data, textStatus) => {
		if (textStatus.toUpperCase() === 'OK') {
			$('div#api_status').removeClass('unavailable');
			$('div#api_status').addClass('available');
		} else {
			$('div#api_status').removeClass('available');
			$('div#api_status').addClass('unavailable');
		}
		$('.lcations>4h').html(cities_names.join(', '));
	});
	$.post({
		url: places_url,
		data: {
			states: states_ids,
			cities: cities_ids,
			amenities: amenities_ids
		},
		contentType: 'application/json',
	}).done(function(response){
		places = JSON.parse(response);
		places.forEach((place) => {
			let article = $('<articel><article>');
			let titleBox = $(`<div class="title_box"></div>`);
			titleBox.append($(`<h2></h2>`).text(place.name));
			titleBox.append($(`<div class="price_by_night"></div>`).text(place.price_by_night));
			article.append(titleBox);
			let info = $(`<div class="information"></div>`);
			info.append($(`<div class="max_guest"></div>`).text(`${place.max_guest} Guest(s)`));
			info.append($(`<div class="number_rooms"></div>`).text(`${place.number_rooms} Bedroom(s)`));
			info.append($(`<div class="number_bathrooms"></div>`).text(`${place.number_bathrooms} Bathroom(s)`));
			article.append(info);
			let user = $($(`<div class="user"><b>Owner:</b></div>`).text(`${place.user.first_name} ${place.user.last_name}`));
			article.append(user);
			article.append($(`<div class="description"></div>`).text(`${place.description}`));
			$('section.places').append(article);

		});
	});
	$('button').click(function(){
		$.post({
			url: places_url,
			data: {
				amenities: amenities_ids
			},
			contentType: 'application/json',
		}).done(function(response){
			places = JSON.parse(response);
			places.forEach((place) => {
				let article = $('<articel><article>');
				let titleBox = $(`<div class="title_box"></div>`);
				titleBox.append($(`<h2></h2>`).text(place.name));
				titleBox.append($(`<div class="price_by_night"></div>`).text(place.price_by_night));
				article.append(titleBox);
				let info = $(`<div class="information"></div>`);
				info.append($(`<div class="max_guest"></div>`).text(`${place.max_guest} Guest(s)`));
				info.append($(`<div class="number_rooms"></div>`).text(`${place.number_rooms} Bedroom(s)`));
				info.append($(`<div class="number_bathrooms"></div>`).text(`${place.number_bathrooms} Bathroom(s)`));
				article.append(info);
				let user = $($(`<div class="user"><b>Owner:</b></div>`).text(`${place.user.first_name} ${place.user.last_name}`));
				article.append(user);
				article.append($(`<div class="description"></div>`).text(`${place.description}`));
				$('section.places').append(article);
			});
		});
	});
});
