var assert = require('assert');
var English = require('yadda').localisation.English;
var Wall = require('../../index.js'); // The library that you wish to test
var Nightmare = require('nightmare');

//var pageUrl;
//var selectors = require('../selectors');
//var urls = require('../urls');
//var R = require('ramda');
global.cookies = null;
global.page = null;
global.page = Nightmare({
	darkTheme: true,
	x: 1920,
	y: 0,
	height: 740,
	width: 1920,
	show: true,
	fullscreen: false,
	openDevTools: true,
});

module.exports = English.library()
	.when("$NUM start upp", function (number, next) {
		console.log(next)

		//;
				//console.log(`    за адресою ${urls.host}`);
		page
			.goto('http://localhost')
			.wait(3000)
			.then((d)=>{


				return next()
			})
			.catch(err=>{
					console.log('error->', err)
				 next()
			});

		//next();
	})
	.given("$NUM green bottles are standing on the wall", function(number, next) {
		wall = new Wall(number)
		next();
	})
	.when("$NUM green bottle accidentally falls", function(number, next) {
		wall.fall(number);
		next();
	})
	.then("there are $NUM green bottles standing on the wall", function(number, next) {
		assert.equal(number, wall.bottles);
		next();
	})
