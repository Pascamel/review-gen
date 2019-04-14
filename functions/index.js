const functions = require('firebase-functions');
const _ = require('lodash');
const cors = require('cors')({
  origin: true
});

const reviews = [
  '[name] [was|was|were] [a |a |]wonderful guest[||s]. [He|She|They] left the apartment as clean and organized as it was when [He|She|They] arrived. Would definitely recommend [name] to other hosts on Airbnb!',
  'I had the pleasure to host [name]. [He|She|They] made a real effort to leave the premises as clean as when [he|she|they] arrived. Would love to have [him|her|them] back!',
  'It was a pleasure hosting [name]. [He|She|They] left the apartment clean and tidy and [was|was|were] very mindful of the place! Sincerely and warmly recommended!',
  '[name] [was a|was a|were] dream guest[||s]! The apartment was left clean and in great conditions. NO Complaints. Would be happy to have [him|her|them] as guest ANYTIME!',
  '[name] booked with us and [was an|was an|were] excellent guest[||s]. I recommend [him|her|them] to other hosts on Airbnb!',
  'Wonderful guest[||s]! [He|She|They] left the apartment in perfect shape and [was|was|were] great at communicating. Would host [him|her|them] again for sure!',
  'It was so great to have [name] staying at the apartment. [He was|She was|They were] a delight to host and I hope to have the opportunity to host [him|her|them] again someday.',
  '[name] [was|was|were] [a |a |] great guest[||s]. I am glad [he|she|they] chose to stay with us, it was a real pleasure to host [him|her|them]. We would be happy to have [him|her|them] back and recommend [him|her|them] to other Airbnb hosts. ',
  '[name] [was|was|were] awesome to have as [a |a |]guest[||s] and did a great job on communicating on matters like check-in and check-out time. I can recommend [him|her|them] and I hope to have [him|her|them] again as [a guest|a guest|guests].',
  '[name] [was a|was a|were] fantastic guest[||s]! [He|She|They] always kept in touch before and during [his|her|their] stay. [He was|She was|They were] also very polite, tidy and quiet.',
  '[name] [was a|was a|were] wonderful guest[||s] and terrific [person|person|people]. [He was|She was|They were] really friendly and easy-going. [He was|She was|They were] very respectful of house rules.',
  'It was great hosting [name]. [He was|She was|They were] extremely easy to communicate with! [name] [was|was|were] really respectful of our place. Thanks so much for your stay, it was a pleasure having you!',
  '[name] [was a|was a|were] very good guest[||s]. [He was|She was|They were] easy to communicate with before and during [his|her|their] stay. [He was|She was|They were] communicative, friendly, interesting to spend time with just chatting, friendly and very neat. Welcome to come back anytime.',
  '[name] [was|was|were] a great guest, very tidy and clean. Strongly recommend him/her/them.',
  'It was a pleasure to welcome [name]. [This|This|These] guest[||s] were very nice and more, very discreet, clean and respectful during [his|her|their] stay. [He is|She is|They are] very welcome next time ! In the meantime, I recommend [This|This|These] traveler[||s] to all others hosts. Thanks again for your confidence. I wish you the best.',
  '[name] [was|was|were] nice! Clean and respectful also kind and friendly! Nothing to add!!! Highly recommended!',
  '[name] [was a|was a|were] lovely guest[||s] to have staying with us. [He|She|They] [was|was|were] clean and tidy, fun to talk to and respectful of our house and rules. I would welcome [name] back anytime.',
  '[name] [was a|was a|were] great guest[||s]! [He|She|They] kept the apartment clean, and respected my handful of house rules. Would love to host [him|her|them] again!',
  '[name] [was a|was a|were] lovely guest[||s]. [He|She|They] [was|was|were] friendly, clean and respectful of my apartment. I would welcome [him|her|them] back any time and highly recommend them as guest[||s].',
  '[name] [was|was|were] lovely guest[||s]. [He|She|They] were just wonderful people and I would have [him|her|them] again.',
  '[name] [was|was|were] great guest[||s]. Communication was very good between us. [He|She|They] left the bathroom clean and ready for use, as well as the kitchen. Would welcome them back anytime.',
  '[name] [was|was|were] great guest[||s] who highly respected house rules as well as my neighborhood. Also [He|She|They] cleaned up the bedroom same as it was at check in. Highly recommended guest[||s].',
  '[name] [was|was|were] very nice, polite and respectful of our home and belongings. You are welcome back anytime!',
  'Great guest[||s]. Serious, tidy and friendly. Highly recommended guest[||s]. Thanks for your trust in booking with us and thanks for leaving the place in such a perfect condition! We hope to see you again!',
  'Nice guest[||s] who kept the place clean and tidy. We look forward to seeing [him|her|them] again in the future.',
  '[name] [was|was|were] an absolute joy to be around and host. [He|She|They] is clean, respectful, and quiet but also very personable. [He|She|They] will always be welcome in my home. [name] is an asset to the Airbnb community and anyone who has the great fortune of hosting [him|her|them] will be happy they did.',
  'Really wonderful guest[||s]! It was such a pleasure having [him|her|them] stay in our home. We had a wonderful time talking with [him|her|them]. [He|She|They] were very kind, respectful, and tidy. We would love to have [him|her|them] stay again and we definitely recommend [him|her|them] to ANY future hosts.',
  '[name] was awesome! Would host [him|her|them] again for sure! Thanks [name]!',
  'Best guest[||s] ever! Exactly the kind of guest[||s] you want at your place. Thank you [name]... Highly recommend!',
  '[name] [was a|was a|were] perfect guest[||s]. I\'d host [him|her|them] again anytime!',
  'Super great guest[||s] to host and a pleasure to have in overall. Would gladly host [him|her|them] again.',
  'It was really nice to host [name]. [He is|She is|They are] nice, friendly, communicative and independent. [He is|She is|They are] respectful of my place and keep it clean and tidy. I can highly recommended [him|her|them] to any airbnb host without any hesitation.',
  '[name] [is|is|are] very sweet and respectful. It was a pleasure to have [him|her|them] at home, and [he is|she is|they are] always welcome to come back!',
  '[name] [was|was|were] great guest[||s]. [He|She|They] had good communication and left the house in good condition. I would welcome [him|her|them] back anytime and recommend [him|her|them] to other hosts.',
  '[name] [was|was|were] FANTASTIC guest[||s]. I absolutely loved having [him|her|them]. If [he|she|they] [returns|returns|return] to my city I hope [he|she|they] will come back and stay with me :-) I highly recommend to other hosts!',
  '[name] [was|was|were] very friendly and polite. [He|She|They] have left everything clean and in perfect condition. Strongly recommended.',
  'Great guest[||s]. [He was|She was|They were] totally respectful of the apartment.I would love to have [him|her|them] again.',
  '[name] [was|was|were] a wonderful guest[||s]. [He|She|They] [is|is|are] warm, always wearing a smile, and makes the home feel great! I would highly recommend [name] as a guest[||s], you\'d be lucky to have [him|her|them] . [name] is responsible, clean, quiet, friendly, and overall wonderful! Would love to host [him|her|them] again and recommend [him|her|them] highly!'
];

var replaceName = function (s, name) {
  while (s.indexOf('[name]') > -1) s = s.replace('[name]', name);
  return s;
}

var pickTypeSpecifics = function(s, type) {
  while (s.indexOf('[') > -1) {
    var replacer = s.substring(s.indexOf('['), s.indexOf(']')+1);
    var picker = replacer.substring(1, replacer.length-1);
    var list = picker.split('|');
    s = s.replace(replacer, list[type - 1]);
  }
  return s;
}

exports.getReview = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var randomIntFromInterval = function (min, max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }    
    
    var genericGuestName = function (type) {
      var result = '';
      _(['', 'the guest', 'the guest', 'the guests']).each((v, i) => {
        if (parseInt(type)===i) result = v;
      });
      return result;
    }

    var formatReview = function(name, type) {
      var s = reviews[randomIntFromInterval(0, reviews.length-1)];
      s = replaceName(s, name);
      s = pickTypeSpecifics(s, type);
      return s;
    }	    

    var type_review = parseInt(req.body.data.data.type) || 0;

    if (type_review < 1 || type_review > 3) res.status(400).send({data: {
      review: '',
      message: 'INVALID_GUEST_TYPE'
    }});

    var name_review = req.body.data.data.name || genericGuestName(type_review)

    res.status(200).send({data: {
      review: formatReview(name_review, type_review),
      message: 'OK'
    }});
  });
});

exports.getAllReviews = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var results = [];

    _.each(reviews, (review) => {
      let review1 = review;
      review1 = replaceName(review1, 'John and Jane');
      review1 = pickTypeSpecifics(review1, 3);
      results.push(review1);

      let review2 = review;
      review2 = replaceName(review2, 'John');
      review2 = pickTypeSpecifics(review2, 1);
      results.push(review2);

      let review3 = review;
      review3 = replaceName(review3, 'Jane');
      review3 = pickTypeSpecifics(review3, 2);
      results.push(review3);
    });

    res.status(200).send({data: {
      reviews: results, 
      message: 'OK'
    }});
  });
});