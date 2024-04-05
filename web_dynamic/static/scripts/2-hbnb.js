$(function(){
	const amenities_ids = [];
	const amenities_names = [];
	const url = 'http://0.0.0.0:5001/api/v1/status/';
	$('.popover input[type="checkbox"]').on('change', function(event){
		if(this.checked) {
			amenities_ids.push($(this).attr('data-id'));
			amenities_names.push($(this).attr('data-name'));
		} else {
			amenities_ids.pop($(this).attr('data-id'));
			amenities_names.pop($(this).attr('data-name'));
		}
		$('.amenities>h4').html(amenities_names.join(', '));
	});
	$.get(url, (data) => {
		if (data.status === 'OK') {
			$('div#api_status').removeClass('unavailable');
			$('div#api_status').addClass('available');
		} else {
			$('div#api_status').removeClass('available');
			$('div#api_status').addClass('unavailable');
		}
	});
});
