$(document).ready(function() {

	$('#guest_type').change(function(e) {
		_(['', 'eg. John', 'eg. Jane', 'eg. John and his friends']).each(function(v, i) {
			if ($('#guest_type').find(":selected").val()==i) $('#guest_name').attr('placeholder', v);
		});
	});
	
	var genericGuestName = function () {
		var result = '';
		_(['', 'The guest', 'The guest', 'The guests']).each(function(v, i) {
			if ($('#guest_type').find(":selected").val()==i) result = v;
		});
		return result;
	}

	var randomIntFromInterval = function (min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
	}

	var replaceName = function (string, name) {
		return string.replace(/\[name\]/g, name)
	}

	var pickTypeSpecifics = function(string, type) {
		var array = string.split(/[\[\]]/g);
		var result = [];
		_.each(array, function(m) {
			var array2 = m.split('|');
			if (array2.length == 3) {
				result.push(array2[type-1]);
			} else {
				result.push(m);
			}
		});
		return result.join('');
	}

	var formatPartString = function(options) {
		var s = options[randomIntFromInterval(0, options.length-1)];
		if ($('#guest_name').val().length) {
			s = replaceName(s, $('#guest_name').val());
		} else {
			s = replaceName(s, genericGuestName());
		}
		s = pickTypeSpecifics(s, $('#guest_type').find(":selected").val());
		return s;
	}

	var introduction = function () {
		return formatPartString([
			'[name] [was|was|were] [a |a |]wonderful guest[||s].',
			//I had the pleasure to host (Guest names) (during their stay in (location name)).
			'It was a pleasure hosting [name].',
			'[name] [was a|was a|were] dream guest[||s]!',
			'[name] booked with us and [was an|was an|were] excellent guest[||s].',
			'Wonderful guest[||s]!',
			//'[name] was/were so great to have stay at the apartment/house.',
			//(Guest names) was/were (a) great guest(s). I am glad he chose to stay in my (property type) during his time in (location name). 
			'[name] [was|was|were] awesome to have as [a |a |]guest[||s].',
			'[name] [was a|was a|were] fantastic guest[||s]!',
			'[name] [was a|was a|were] wonderful guest[||s] and terrific [person|person|people].',
			'It was great hosting [name].',
			'[name] [was a|was a|were] very good guest[||s].'
		]);
	}

	var cleanliness = function () {
		return formatPartString([
			//'The (property type) was left in great condition. Everything clean and organized as it was when they arrived.',
			'[He|She|They] made a real effort to leave the premises as clean as when [he|she|they] arrived.',
			'[name] left the (property type) clean and tidy.',
			'[He|She|They] left the (property type) really organized and [was|was|were] very mindful of the place!',
			//'The (property type) was left clean and in great conditions.',
			'[He|She|They] left the (property type) in perfect shape and [was|was|were] great at communicating.'
		]);
	}

	var communication = function () {
		return formatPartString([
			'They always kept in touch before and during their stay.',
			'[He was|She was|They were] easy to communicate with before and during [his|her|their] stay.',
			'[He was|She was|They were] extremely easy to communicate with!',
			'[He|She|They] did a great job on communicating with me on matters like check in and check out time.'
		]);
	}

	var friendliness = function () {
		return formatPartString([
			'[He was|She was|They were] super nice.',
			'[He was|She was|They were] really friendly and easy-going.',
			'[He was|She was|They were] communicative, friendly, interesting to spend time with just chatting, friendly and very neat.'
		]);
	}

	var respect = function () {
		return formatPartString([
			'[He was|She was|They were] very respectful of house rules.',
			'[name] [was|was|were] really respectful of our place.',
			'[He was|She was|They were] totally respectful of the apartment.',
			'[He was|She was|They were] also very polite, tidy and quiet.'
		]);
	}

	var finalNote = function () {
		return formatPartString([
			'I would definitely recommend [name] to other hosts on Airbnb!',
			'Sincerely and warmly recommended!',
			'[He was|She was|They were] a delight to host and I hope to have the opportunity again someday.',
			'Welcome to come back anytime.',
			'NO Complaints. Would be happy to have [him|her|them] as guest ANYTIME!',
			'Would most certainly let [him|her|them] stay - anytime, [he is a|she is a|they are] lovely guest[||s]!',
			'It was a pleasure to host [him|her|them] and we would be happy to have [him|her|them] back and also recommend them to other Airbnb hosts. A great experience with [a great guest|a great guest|great guests]!',
			'I can recommend [him|her|them] and I hope to have [him|her|them] again as a guest.',
			'I recommend them to other hosts on Airbnb!',
			'Would love to have [him|her|them] back!',
			'Thanks so much for your stay, it was a pleasure having you!',
			'Come back any time!',
			'I would welcome [name] back anytime.',
			'Would host [him|her|them] again for sure!',
			'[He is|She is|They are] welcome back anytime. I recommend [him|her|them] to the airbnb hosting community.',
			'Would love to host [him|her|them] again and recommend [him|her|them] highly!',
			'I enjoyed meeting [name], recommend [him|her|them] highly and look forward to [his|her|their] return.',
			'Everything regarding [his|her|their] stay went smoothly. We would gladly have [him|her|them] back.',
			'Would love to have [him|her|them] stay again.',
			'I can only recommend [him|her|them]. I wish you the best :)',
			'You would be welcome back anytime and we would recommend you unconditionally.',
			'[He is|She is|They are] highly recommended to other hosts.',
			'I would highly recommend [him|her|them] to other hosts, [he|she|they] will be getting a 5 star rating in every category and we hope to see [him|her|them] again in the future.',
			'[name], thanks for visiting us!',
		]);
	}

	$('textarea#reviewGenerated').hide();
    $('button#copyReview').hide();


	$('#generateReview').click(function(e) {

		$("textarea#reviewGenerated").hide();
    $('button#copyReview').hide();

		if ($('#guest_type').find(":selected").val() <= 0) {
			toastr.error('Please select a gender.');
			return;
		}

		var parts = [];

		parts.push(introduction());
		//$(selector).is(':checked')
		if ($('#guest_cleanliness').is(':checked')) parts.push(cleanliness());
		if ($('#guest_communication').is(':checked')) parts.push(communication());
		if ($('#guest_friendliness').is(':checked')) parts.push(friendliness());
		if ($('#guest_respect').is(':checked')) parts.push(respect());
		parts.push(finalNote());

		$('textarea#reviewGenerated').val(parts.join(' '));
		$('textarea#reviewGenerated').show();
    $('button#copyReview').show();
	});

  $('#copyReview').click(function(e) {
    // document.querySelector('#textarea#reviewGenerated').select();
    $('textarea#reviewGenerated').select();
    document.execCommand('copy');
    toastr.success('Copied to clipboard!');
  });
});