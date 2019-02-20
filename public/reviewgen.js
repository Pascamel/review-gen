$(document).ready(function() {
	var placeholders = ['', 'Enter guest name', 'Enter guest name', 'Enter guests name'];
	var genders = ['', 'Male', 'Female', 'Group'];

	$('#guest_type').val(3);
	$('#guest_type').change(function(e) {
		var idx = parseInt($('#guest_type').find(":selected").val());
		$('#guest_name').attr('placeholder', placeholders[idx]);

		ga('send', 'event', 'Review', 'Select gender', genders[idx], 0);
	});

	var timeoutId = null;

	$('#guest_name').keydown(function(e) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(function(){
			ga('send', 'event', 'Review', 'Enter name', $('#guest_name').val() || '', 0);
		}, 3000);
	});

	var reviewEdited = false;

	$('#reviewGenerated').keydown(function(e) {
		if (reviewEdited) return;

		reviewEdited = true;
		ga('send', 'event', 'Review', 'Edit review', '', 0);
	});

	$('#scrolldown').click(function(e) {
		$("html, body").stop().animate({scrollTop: ($('#scrollup').position().top - 30) + 'px'}, 1000);
	});

	$('#scrollup').click(function(e) {
		$("html, body").stop().animate({scrollTop: 0}, 1000);
	});

	$('textarea#reviewGenerated').hide();
	$('button#copyReview').hide();
	$('#feedback2').hide();

	$('#generateReview').click(function(e) {
		$("textarea#reviewGenerated").hide();
    $('button#copyReview').hide();
		if ($('#guest_type').find(":selected").val() <= 0) {
			toastr.error('Please select your guest\'s gender.');
			ga('send', 'event', 'Review', 'Generate Review', 'Failure (Missing gender)', 0);
			return;
		}
		
		var getReview = firebase.functions().httpsCallable('getReview');
		getReview({
			data: {
				type: $('#guest_type').find(":selected").val(), 
				name: $('#guest_name').val()
			}
		}).then(function(result) {
			console.log('data', result.data);

			$('#feedback1').hide();
			$('textarea#reviewGenerated').val(result.data.review);
			$('textarea#reviewGenerated').show();
			$('button#copyReview').show();
			$('#feedback2').show();

			var idx = parseInt($('#guest_type').find(":selected").val());
			ga('send', 'event', 'Review', 'Generate Review', 'Success (' + genders[idx] + ')', 0);
		});
	});

  $('#copyReview').click(function(e) {
    $('textarea#reviewGenerated').select();
    document.execCommand('copy');
		toastr.success('Copied to clipboard!');
		
		ga('send', 'event', 'Review', 'Copy to clipboard', '', 0);
	});
});