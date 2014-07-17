var express = require('express');
var http = require('http');
var https = require('http');
var path = require('path');
var app = express();




module.exports = function(app) {
	
	//usernames
	var items = ['guilhermeyo', 'teamfabrica', 'gianlucarispo', 'theLorenzKid', 'Andrew_Breck', 'theforthwall', 'apokusin', 'danialaez', 'fschultz_', 'afivos', 'ggus98', 'chasekeeling', 'by_Jaden', 'jmkcc', 'therealcoelho', 'larrybolt', 'matteo_pasuto', '_mkos', 'matthiasleitner', 'InternetFigure', 'Rgre1', 'sanjeetsuhag', 'covalentwill', 'nilshoenson']


	var twitter = require('twitter');
	/*twitter verification*/
	var OAuth = require('oauth').OAuth
		, otw = new OAuth(
		"https://api.twitter.com/oauth/request_token",
		"https://api.twitter.com/oauth/access_token",
		"YOUR AUTH KEY",
		"YOUR AUTH KEY SECRET",
		"1.0",
		"http://followback-m4e.rhcloud.com//auth/twitter/callback",
		"HMAC-SHA1"
		);

	app.get('/auth/twitter', function(req, res) {
   
		otw.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
	   
		  req.session.oauthtw = {
			token: oauth_token,
			token_secret: oauth_token_secret
		  };
		  res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
		}
	  );

	});

	
	app.get('/auth/twitter/callback', function(req, res) {
	  if (req.session.oauthtw) {
		req.session.oauthtw.verifier = req.query.oauth_verifier;
		var oauth_data = req.session.oauthtw;

		otw.getOAuthAccessToken(
		  oauth_data.token,
		  oauth_data.token_secret,
		  oauth_data.verifier,
		  function(error, oauth_access_token, oauth_access_token_secret, results) {
			if (error) {
			  console.log(error);
			  res.send("Authentication Failure!");
			}
			else {
			  req.session.ottw = oauth_access_token;
			  req.session.ottws = oauth_access_token_secret;
			  var twit = new twitter({
					consumer_key: 'YOUR AUTH KEY',
					consumer_secret: 'YOUR AUTH KEY SECRET',
					access_token_key: req.session.ottw,
					access_token_secret: req.session.ottws
				});
			  for(var i = 0; i < items.length; i++){
				var tw_sn = 'https://api.twitter.com/1.1/friendships/create.json?screen_name=' + items[i];
				twit.post(tw_sn, { include_entities:true }, function(err, reply) {
					console.log(err);
					console.log(reply);
					console.log('done');
				});
				if(i === items.length - 1){
					res.redirect('/success');
				}
			  }
			  
			}
		  }
		);
	  }
	  else {
		res.redirect('/'); // Redirect to login page
	  }
	});

	app.get('/', function(req, res) {
		res.render('index',{
			items:items
		});
	});
	app.get('/success', function(req, res) {
		res.render('success');
	});
}