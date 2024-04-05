$(function(){
	const amenities_ids = [];
	const amenities_names = [];
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
});
