const functions = require('firebase-functions');
const _ = require('lodash');
const cors = require('cors')({
  origin: true
});

const reviews = [
  '[name] [was a|was a|were] wonderful guest[||s]. [He|She|They] left the apartment as clean and organized as it was when [he|she|they] arrived. Would definitely recommend [name] to other hosts on Airbnb!',
  'I had the pleasure to host [name]. [He|She|They] made a real effort to leave the premises as clean as when [he|she|they] arrived. Would love to have [him|her|them] back!',
  'It was a pleasure hosting [name]. [He|She|They] left the apartment clean and tidy and [was|was|were] very mindful of the place! Sincerely and warmly recommended!',
  '[name] [was a|was a|were] dream guest[||s]! The apartment was left clean and in great conditions. NO Complaints. Would be happy to have [him|her|them] as guest ANYTIME!',
  '[name] booked with us and [was an|was an|were] excellent guest[||s]. I recommend [him|her|them] to other hosts on Airbnb!',
  'Wonderful guest[||s]! [He|She|They] left the apartment in perfect shape and [was|was|were] great at communicating. Would host [him|her|them] again for sure!',
  'It was so great to have [name] staying at the apartment. [He was|She was|They were] a delight to host and I hope to have the opportunity to host [him|her|them] again someday.',
  '[name] [was a|was a|were] great guest[||s]. I am glad [he|she|they] chose to stay with us, it was a real pleasure to host [him|her|them]. We would be happy to have [him|her|them] back and recommend [him|her|them] to other Airbnb hosts. ',
  '[name] [was|was|were] awesome to have as [a |a |]guest[||s] and did a great job on communicating on matters like check-in and check-out time. I can recommend [him|her|them] and I hope to have [him|her|them] again as [a guest|a guest|guests].',
  '[name] [was a|was a|were] fantastic guest[||s]! [He|She|They] always kept in touch before and during [his|her|their] stay. [He was|She was|They were] also very polite, tidy and quiet.',
  '[name] [was a|was a|were] wonderful guest[||s] and terrific [person|person|people]. [He was|She was|They were] really friendly and easy-going. [He was|She was|They were] very respectful of house rules.',
  'It was great hosting [name]. [He was|She was|They were] extremely easy to communicate with! [name] [was|was|were] really respectful of our place. Thanks so much for your stay, it was a pleasure having you!',
  '[name] [was a|was a|were] very good guest[||s]. [He was|She was|They were] easy to communicate with before and during [his|her|their] stay. [He was|She was|They were] communicative, friendly, interesting to spend time with just chatting, friendly and very neat. Welcome to come back anytime.',
  '[name] [was|was|were] a great guest, very tidy and clean. Strongly recommend [him|her|them].',
  'It was a pleasure to welcome [name]. [This|This|These] guest[||s] [was|was|were] very nice and more, very discreet, clean and respectful during [his|her|their] stay. [He is|She is|They are] very welcome next time! In the meantime, I recommend [this|this|these] traveler[||s] to all others hosts. Thanks again for your confidence. I wish you the best.',
  '[name] [was|was|were] nice! Clean and respectful also kind and friendly! Nothing to add!!! Highly recommended!',
  '[name] [was a|was a|were] lovely guest[||s] to have staying with us. [He|She|They] [was|was|were] clean and tidy, fun to talk to and respectful of our house and rules. I would welcome [name] back anytime.',
  '[name] [was a|was a|were] great guest[||s]! [He|She|They] kept the apartment clean, and respected my handful of house rules. Would love to host [him|her|them] again!',
  '[name] [was a|was a|were] lovely guest[||s]. [He was|She was|They were] friendly, clean and respectful of my apartment. I would welcome [him|her|them] back any time and highly recommend [him|her|them] as [a |a |]guest[||s].',
  '[name] [was|was|were] lovely guest[||s]. [He was|She was|They were] just [a |a |]wonderful [person|person|people] and I would have [him|her|them] again.',
  '[name] [was a|was a|were] great guest[||s]. Communication was very good between us. [He|She|They] left the bathroom clean and ready for use, as well as the kitchen. Would welcome [him|her|them] back anytime.',
  '[name] [was a|was a|were] great guest[||s] who highly respected house rules as well as my neighborhood. Also [he|she|they] cleaned up the bedroom same as it was at check in. Highly recommended guest[||s].',
  '[name] [was|was|were] very nice, polite and respectful of our home and belongings. You are welcome back anytime!',
  'Great guest[||s]. Serious, tidy and friendly. Highly recommended guest[||s]. Thanks for your trust in booking with us and thanks for leaving the place in such a perfect condition! We hope to see you again!',
  'Nice guest[||s] who kept the place clean and tidy. We look forward to seeing [him|her|them] again in the future.',
  '[name] [was|was|were] an absolute joy to be around and host. [He is|She is|They are] clean, respectful, and quiet but also very personable. [He|She|They] will always be welcome in my home. [name] [is|is|are] an asset to the Airbnb community and anyone who has the great fortune of hosting [him|her|them] will be happy they did.',
  'Really wonderful guest[||s]! It was such a pleasure having [him|her|them] stay in our home. We had a wonderful time talking with [him|her|them]. [He was|She was|They were] very kind, respectful, and tidy. We would love to have [him|her|them] stay again and we definitely recommend [him|her|them] to ANY future hosts.',
  '[name] [was|was|were] awesome! Would host [him|her|them] again for sure! Thanks [name]!',
  'Best guest[||s] ever! Exactly the kind of guest[||s] you want at your place. Thank you [name]... Highly recommended!',
  '[name] [was a|was a|were] perfect guest[||s]. I\'d host [him|her|them] again anytime!',
  'Super great guest[||s] to host and a pleasure to have in overall. Would gladly host [him|her|them] again.',
  'It was really nice to host [name]. [He is|She is|They are] nice, friendly, communicative and independent. [He is|She is|They are] respectful of my place and keep it clean and tidy. I can highly recommended [him|her|them] to any airbnb host without any hesitation.',
  '[name] [is|is|are] very sweet and respectful. It was a pleasure to have [him|her|them] at home, and [he is|she is|they are] always welcome to come back!',
  '[name] [was a|was a|were] great guest[||s]. [He|She|They] had good communication and left the house in good condition. I would welcome [him|her|them] back anytime and recommend [him|her|them] to other hosts.',
  '[name] [was a|was a|were] FANTASTIC guest[||s]. I absolutely loved having [him|her|them]. If [he|she|they] [returns|returns|return] to my city I hope [he|she|they] will come back and stay with me again :-) I highly recommend to other hosts!',
  '[name] [was|was|were] very friendly and polite. [He has|She has|They have] left everything clean and in perfect condition. Strongly recommended.',
  'Great guest[||s]. [He was|She was|They were] totally respectful of the apartment. I would love to have [him|her|them] again.',
  '[name] [was a|was a|were] wonderful guest[||s]. [He is|She is|They are] warm, always wearing a smile, and make[s|s|] the home feel great! I would highly recommend [name] as [a |a |]guest[||s], you\'d be lucky to have [him|her|them]. [name] [is|is|are] responsible, clean, quiet, friendly, and overall wonderful! Would love to host [him|her|them] again and recommend [him|her|them] highly!',
  '[name] [was a|was a|were] very nice guest[||s]: Quiet, clean and respectful. Highly recommended. Thank you!',
  '[name] followed the rules of the apartment well and was kind. I recommend [name] to other hosts. I welcome [him|her|them] anytime. Thank you [name].',
  'We enjoyed hosting [name]. We had a good exchange of messages upfront. During our stay, it was nice to chat with [name] and [he was|she was|they were] respectful of the house rules.',
  '[name] was [a |a |]great guest[||s] who kept the room clean with care for all of the appliances and amenities. We were able to communicate easily. [He is|She is|They are] a very considerate guest[||s]. Thank you [name], see you again!',
  'It was a pleasure hosting [name]. [He is|She is|They are] very friendly and left everything exceedingly clean. I would be more than happy to have [him|her|them] stay home again in the future.',
  'It was a pleasure hosting [name]. [He is|She is|They are] [a |a |]very lovely guest[||s]. We would welcome [him|her|them] back anytime!',
  'thank you so much for taking good care of our listing. We would like to see you again. You will always be welcome to stay with us.',
  '[name] [was a|was a|were] great guest[||s], easy to communicate with, clean, and super helpful. I cannot be more thankful and have no doubts in recommending [name] to any host.',
  '[name] [is an|is an|are] amazing guest[||s]. I wish they all were like [him|her|them]. [He was|She was|They were] easy to communicate with throughout the process, [he|she|they] appreciated my personal home and my touches. [He|She|They] left my home immaculately clean. I recommend [him|her|them] to all hosts.',
  'Really nice to host -- kind and friendly in every way -- very happy to welcome [him|her|them] back.',
  '[Name] [was|was|were] [a|a|] great guest[||s]! [He|She|They] communicated well, [was|was|were] quiet and left [his|her|their] room in excellent condition! Would love to host [him|her|them] again!',
  '[Name] [is|is|are] [a|a|] wonderful guest[||s]. Very polite, considerate and neat. It was a pleasure to have [him|her|them] and [he|she|they] [is|is|are] welcome back next time [he|she|they] [is|is|are] around.',
  '[Name] took great care of my property.  Thank you [Name]. You can come back anytime.',
  'A pleasure to host -- happy to have [him|her|them] at any time - we say that the best compliment is to wish that [he|she|they] would return and we say as soon as [he|she|they] wish[es|es|]',
  '[Name] [was|was|were] [a|a|] great guest[||s]! Highly recommend as [he|she|they] [is|is|are] super easy to communicate with and left the place very clean!',
  'It was great having [Name] as [a |a |]guest[||s]! [He|She|They] [is|is|are] interesting, laid-back and [has|has|have] a sense of humor. We enjoyed [him|her|them] staying with us very much!',
  '[Name] [was|was|were] really great to host -- [He|She|They] [was|was|were] out and about a lot but when we had chance to chat found [him|her|them] a real pleasure -- happy to have [him|her|them] back anytime',
  'It was a pleasure to host [Name]! Easy-going, great at communication and left the place in great condition. [Name] [is|is|are] welcome back anytime! Thanks again!',
  'It was a pleasure hosting [Name]. [He|She|They] left the house in excellent condition. [He|She|They] come highly recommended.',
  'It was a pleasure hosting [Name] during [his|her|their] stay. Thank you again for being such [an |an |]amazing guest[||s]! Hopefully we’ll see you all again soon.',
  '[Name] [was|was|were] [a|a|] delightful guest[||s]. Communicative, honest and open. We would gladly host [his|her|their] again.',
  '[Name] [was|was|were] lovely! [He|She|They] left our place in great shape! I’d be glad to host [Name] again anytime. [Name] took great care of my apartment, left it clean and tidy, and was a pleasure to speak with. Highly recommended!',
  '[Name] [was|was|were] great -- in every way -- happy to have [him|here|them] back at anytime',
  '[Name] left my place in good shape. House rules were observed as well. Recommended!',
  'It was my pleasure hosting [Name]. [He|She|They] respected my house rules, communication ran smoothly, and most importantly, [he|she|they] are friendly! I would gladly host [him|here|them] again.  ',
  'Dear [Name]! Thank you for your stay here with us! It was a pleasure to be able to accommodate you. We hope that we can accommodate you again at some time in the future! With kind regards.',
  'It was nice and easy hosting [Name]. Thanks for taking such a great care of the place. Communication was easy and everything was smooth and simple. they are very friendly and welcoming. [He|She|They] left the place clean. Looking forward to host [Name] again.',
  '[Name] [is a|is a|are] wonderful guest[||s]. [He|She|They] [is|is|are] friendly, communicate really well. [He|She|They] left our home very clean, as in REALLY CLEAN. We are impressed how [he|she|they] leave our home that way. [He|She|They] followed house rules. It\'s been our pleasure to host [him|here|them] and definitely love to accommodate [him|here|them] again whenever there will be a chance. 5 star guest[||s]!!',
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