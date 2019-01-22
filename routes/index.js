'use strict';
const nodemailer = require('nodemailer'); 
//var resete = require('../nodemailer/passwordreset.js');
var reset = require('../functions/mailfunctions.js');
var fillup = require('../functions/withsponsor.js');
var timer = require( '../functions/datefunctions.js' ); 
var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
var router = express.Router();
var mysql = require( 'mysql' );
var db = require('../db.js');
var expressValidator = require('express-validator'); 
var  matrix = require('../functions/normal.js'); 
var  timer = require('../functions/timer.js'); 
var bcrypt = require('bcrypt-nodejs');

function rounds( err, results ){ 
	if ( err ) throw err;
}
const saltRounds = bcrypt.genSalt( 10, rounds);

var pool  = mysql.createPool({
  connectionLimit : 100,
  multipleStatements: true, 
  waitForConnections: true,
  host: "localhost",
  user: "swiftrevolver",
  password: 'swiftrevolver994',
  database: "revolver"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user); 
  
 	res.render('index', { title: 'SWIFT REVOLVER' });		

});

// get how it works
router.get('/howitworks',  function (req, res, next){ 

//console.log( req.route.path )
  res.render('howitworks', {title: "HOW IT WORKS"});
}); 

router.get('/faq',  function (req, res, next){
  res.render('faq', {title: "FAQ"});
});


//get web courses
router.get('/webcourse', ensureLoggedIn('/login'), function (req, res, next){
	var currentUser = req.session.passport.user.user_id;
	console.log( currentUser)
	db.query( 'SELECT username FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
		if (err) throw err;
		var username = results[0].username;
		// check if the user is in the feeder matrix.
		db.query( 'SELECT user FROM feeder WHERE user = ?', [username], function ( err, results, fields ){
			if (err) throw err;
			if (results.length === 0){
				res.redirect('unauthorized');
			}else{
				//check his feeder tree to see his last.
				db.query( 'SELECT user FROM feeder_tree WHERE user = ?', [username], function ( err, results, fields ){
					if (err) throw err;
					var last = results.slice(-1)[0];
					var lasttree = {
						a: last.a,
						b: last.b,
						c: last.c
					}
					if (last.a === null || last.b === null || last.c === null){
						res.render('webcourse', {title: 'WEB DEVELOPMENT COURSES'});
					}else{
						res.redirect('unauthorized');
					}
				});
			}
		});
	});
});

//get the earnings page.
router.get('/orders', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	var firstcount = timer.firstcount()
	db.query( 'SELECT username, full_name FROM user WHERE user_id = ? ', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		var username = results[0].username;
		var fullname = results[0].full_name;
		//check if the user has a paid order that is still in pending status
		db.query( 'SELECT * FROM orders WHERE status = ? and payer = ?', ['pending', username], function ( err, results, fields ){
			if( err ) throw err;
			if (results.length === 0){
				//check if he has any paid order that is unconfirmed.
				db.query( 'SELECT * FROM orders WHERE status = ? and payer = ?', ['unconfirmed', username], function ( err, results, fields ){
					if( err ) throw err;
					if (results.length === 0){
						//check if he has any receiving order is pending
						db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['pending', username], function ( err, results, fields ){
							if( err ) throw err;
							if (results.length === 0){
								//check if he has any receiving order is unconfirmed
								db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['unconfirmed', username], function ( err, results, fields ){
									if( err ) throw err;
									if (results.length === 0){
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														var message = 'Ooops! For now, you do not have an order... When you get one, you will see it here.';
														res.render('orders',  { title: 'MY EARNINGS', message: message});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', userpending: userpending, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}else{
										var receiverunconfimed = results;
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', receiverunconfimed: receiverunconfimed});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', receiverunconfimed: receiverunconfimed, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', userpending: userpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}
								});
							}else{
								var receiverpending = results;
								//check if he has any receiving order is unconfirmed
								db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['unconfirmed', username], function ( err, results, fields ){
									if( err ) throw err;
									if (results.length === 0){
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', receiverpending: receiverpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', receiverpending: receiverpending, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', receiverpending: receiverpending, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', receiverpending: receiverpending, userpending: userpending, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}else{
										var receiverunconfimed = results;
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', receiverunconfimed: receiverunconfimed, receiverpending: receiverpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', receiverunconfimed: receiverunconfimed, receiverpending: receiverpending, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', receiverunconfimed: receiverunconfimed, receiverpending: receiverpending, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', userpending: userpending, receiverpending: receiverpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}
								});
							}
						});
					}else{
						var payerunconfirmed = results;
						db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['pending', username], function ( err, results, fields ){
							if( err ) throw err;
							if (results.length === 0){
								//check if he has any receiving order is unconfirmed
								db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['unconfirmed', username], function ( err, results, fields ){
									if( err ) throw err;
									if (results.length === 0){
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed,});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS',payerunconfirmed: payerunconfirmed, userpending: userpending, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}else{
										var receiverunconfimed = results;
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', receiverunconfimed: receiverunconfimed});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', receiverunconfimed: receiverunconfimed, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', userpending: userpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}
								});
							}else{
								var receiverpending = results;
								//check if he has any receiving order is unconfirmed
								db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['unconfirmed', username], function ( err, results, fields ){
									if( err ) throw err;
									if (results.length === 0){
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed, receiverpending: receiverpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed, receiverpending: receiverpending, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed, receiverpending: receiverpending, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed, receiverpending: receiverpending, userpending: userpending, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}else{
										var receiverunconfimed = results;
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed,receiverunconfimed: receiverunconfimed, receiverpending: receiverpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed, receiverunconfimed: receiverunconfimed, receiverpending: receiverpending, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed, receiverunconfimed: receiverunconfimed, receiverpending: receiverpending, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerunconfirmed: payerunconfirmed, userpending: userpending, receiverpending: receiverpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
			}else{
				var payerpending = results;
				db.query( 'SELECT * FROM orders WHERE status = ? and payer = ?', ['unconfirmed', username], function ( err, results, fields ){
					if( err ) throw err;
					if (results.length === 0){
						//check if he has any receiving order is pending
						db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['pending', username], function ( err, results, fields ){
							if( err ) throw err;
							if (results.length === 0){
								//check if he has any receiving order is unconfirmed
								db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['unconfirmed', username], function ( err, results, fields ){
									if( err ) throw err;
									if (results.length === 0){
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending,});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, userpending: userpending, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}else{
										var receiverunconfimed = results;
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverunconfimed: receiverunconfimed});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverunconfimed: receiverunconfimed, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, userpending: userpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}
								});
							}else{
								var receiverpending = results;
								//check if he has any receiving order is unconfirmed
								db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['unconfirmed', username], function ( err, results, fields ){
									if( err ) throw err;
									if (results.length === 0){
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverpending: receiverpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverpending: receiverpending, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverpending: receiverpending, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverpending: receiverpending, userpending: userpending, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}else{
										var receiverunconfimed = results;
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverunconfimed: receiverunconfimed, receiverpending: receiverpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverunconfimed: receiverunconfimed, receiverpending: receiverpending, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverunconfimed: receiverunconfimed, receiverpending: receiverpending, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, userpending: userpending, receiverpending: receiverpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}
								});
							}
						});
					}else{
						var payerunconfirmed = results;
						db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['pending', username], function ( err, results, fields ){
							if( err ) throw err;
							if (results.length === 0){
								//check if he has any receiving order is unconfirmed
								db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['unconfirmed', username], function ( err, results, fields ){
									if( err ) throw err;
									if (results.length === 0){
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed,});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, userpending: userpending, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}else{
										var receiverunconfimed = results;
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverunconfimed: receiverunconfimed});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, receiverunconfimed: receiverunconfimed, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, userpending: userpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}
								});
							}else{
								var receiverpending = results;
								//check if he has any receiving order is unconfirmed
								db.query( 'SELECT * FROM orders WHERE status = ? and receiver = ?', ['unconfirmed', username], function ( err, results, fields ){
									if( err ) throw err;
									if (results.length === 0){
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, receiverpending: receiverpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, receiverpending: receiverpending, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, receiverpending: receiverpending, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, receiverpending: receiverpending, userpending: userpending, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}else{
										var receiverunconfimed = results;
										//check if the user is just an observer i.e not receiving and not paying.
										db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['pending', username, username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed,receiverunconfimed: receiverunconfimed, receiverpending: receiverpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, receiverunconfimed: receiverunconfimed, receiverpending: receiverpending, userunconfirmed: userunconfirmed});
													}
												});
											}else{
												var userpending = results;
												//check if the user is just an observer i.e not receiving and not paying and still unconfirmed.
												db.query( 'SELECT * FROM orders WHERE status = ? and user = ? and NOT receiver = ?', ['unconfirmed', username, username], function ( err, results, fields ){
													if( err ) throw err;
													if (results.length === 0){
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, receiverunconfimed: receiverunconfimed, receiverpending: receiverpending, userpending: userpending});
													}else{
														var userunconfirmed = results;
														res.render('orders',  { title: 'MY EARNINGS', payerpending: payerpending, payerunconfirmed: payerunconfirmed, userpending: userpending, receiverpending: receiverpending, receiverunconfimed: receiverunconfimed, userunconfirmed: userunconfirmed});
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
    });
});

//get fast teams
router.get('/fastteams',  function (req, res, next){
	//get the max 5
	db.query( 'SELECT phone, full_name, email, username, code, amount FROM user ORDER BY amount DESC LIMIT 3', function ( err, results, fields ){
		if( err ) throw err;
		var fast = results;
		res.render('fastteams', {title: "OUR FASTEST TEAMS", fast: fast});
	});
});

router.get('/news',  function (req, res, next){
	//get the max 5
	db.query( 'SELECT * FROM news ORDER BY id DESC', function ( err, results, fields ){
		if( err ) throw err;
		var news = results;
		res.render('news', {title: "NEWS", news: news});
	});
});

//get dashboard
router.get('/dashboard', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query( 'SELECT subject FROM news', function ( err, results, fields ){
		if ( err ) throw err;
		var last = results.slice(-1)[0];
		var subject = last.subject;
		db.query( 'SELECT subject FROM info WHERE user = ? and subject = ?', [currentUser, subject], function ( err, results, fields ){
			if ( err ) throw err;
			if (results.length === 0){
				//get the subject being rendered.
				db.query( 'SELECT subject FROM news', function ( err, results, fields ){
					if ( err ) throw err;
					var news = results.slice( -1 )[0].subject;
					//check if the person is an admin or not
					db.query( 'SELECT user FROM admin WHERE user = ?', [currentUser], function ( err, results, fields ){
						if( err ) throw err;
						if( results.length === 0 ){
							//user is not an admin
							db.query( 'SELECT username, full_name FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
								if( err ) throw err;
								var username =  results[0].username;
								var name = results[0].full_name;
								//check if the user has updated his profile
								db.query( 'SELECT user FROM profile WHERE user = ?', [username], function ( err, results, fields ){
									if( err ) throw err;
									if( results.length === 0 ){
										var error = 'Please update your profile to see your stats.';
										res.render( 'dashboard', {title: 'DASHBOARD', news: news, error: error});
									}else{
										db.query( 'SELECT * FROM feeder WHERE user = ?', [username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												var message = 'You have not entered the matrix yet. Please enter the matrix';
												var feedentrance = 0; 
												var totalentrance = 0;
												var feederearn = 0;
												var feederbonus  = 0;
												var referral_bonus = 0;
												var total = 0;
												res.render('dashboard', {title: 'DASHBOARD', referral_bonus: referral_bonus, news: news, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus, message: message});
											}else{
												//if the user has been in the feeder matrix before
												//get his last legs
												var last  = results.slice(-1)[0];
												var legs = {
													a: last.a,
													b: last.b,
													c: last.c
												}
												//check the number of times he has entered the feeder stage
												db.query( 'SELECT COUNT(user) AS number FROM feeder WHERE user = ?', [username], function ( err, results, fields ){
													if( err ) throw err;
													var feedentrance = results[0].number;
													var totalentrance = 0 + feedentrance;
													//get his total earnings
													db.query( 'SELECT SUM(feeder_referral) AS feederbonus, SUM(feederearn) AS feederearn FROM earnings WHERE user = ?', [username], function ( err, results, fields ){
														if( err ) throw err;
														var feederearn = results[0].feederearn;
														var feederbonus = results[0].feederbonus;
														var referral_bonus = 0 + feederbonus;
														var total = referral_bonus + feederearn;
														//check if the last legs are filled or not.
														if(legs.a !== null && legs.b !== null && legs.c !== null){
															//give them the opportunity to reenter matrix.
															var error = 'You have filled this leg. Please Re enter the matrix again to keep earning.';
															//create 0 variables for the earning section.
															res.render('dashboard', {title: 'DASHBOARD', a: legs.a, b: legs.b, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, news: news, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus, message: error});
														}
														else{
															//check if the  user has a pending order
															db.query( 'SELECT receiver FROM orders WHERE receiver = ?', [username], function ( err, results, fields ){
																if( err ) throw err;
																if (results.length === 0){
																	//render the legs
																	res.render('dashboard', {title: 'DASHBOARD', a: legs.a, b: legs.b, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, news: news, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus});
																}else{
																	var info = "Someone wants to pay you!"
																	res.render('dashboard', {title: 'DASHBOARD', a: legs.a, b: legs.b, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, news: news, feederearn: feederearn, total: total, message: info, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus});
																}
															});
														}
													});
												});
											}
										});
									}//end of when user update his profile
								});
							});
						}// user is an admin
						else{
							db.query( 'SELECT username, full_name FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
								if( err ) throw err;
								var admin =  results[0].username;
								var name = results[0].full_name;
								//check if the user has updated his profile
								db.query( 'SELECT user FROM profile WHERE user = ?', [admin], function ( err, results, fields ){
									if( err ) throw err;
										if( results.length === 0 ){
										var error = 'Please update your profile to see your stats.';
										res.render( 'dashboard', {title: 'DASHBOARD', news: news, error: error});
									}else{
										db.query( 'SELECT * FROM feeder WHERE user = ?', [admin], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												var message = 'You have not entered the matrix yet. Please enter the matrix';
												var feedentrance = 0; 
												var totalentrance = 0;
												var feederearn = 0;
												var feederbonus  = 0;
												var referral_bonus = 0;
												var total = 0;
												res.render('dashboard', {title: 'DASHBOARD', referral_bonus: referral_bonus, news: news, admin: admin, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus, message: message});
											}else{
												//if the user has been in the feeder matrix before
												//get his last legs
												var last  = results.slice(-1)[0];
												var legs = {
													a: last.a,
													b: last.b,
													c: last.c
												}
												//check the number of times he has entered the feeder stage
												db.query( 'SELECT COUNT(user) AS number FROM feeder WHERE user = ?', [admin], function ( err, results, fields ){
													if( err ) throw err;
													var feedentrance = results[0].number;
													var totalentrance = 0 + feedentrance;
													//get his total earnings
													db.query( 'SELECT SUM(feeder_referral) AS feederbonus, SUM(feederearn) AS feederearn FROM earnings WHERE user = ?', [admin], function ( err, results, fields ){
														if( err ) throw err;
														var feederearn = results[0].feederearn;
														var feederbonus = results[0].feederbonus;
														var referral_bonus = 0 + feederbonus;
														var total = referral_bonus + feederearn;
														//check if the last legs are filled or not.
														if(legs.a !== null && legs.b !== null && legs.c !== null){
															//give them the opportunity to reenter matrix.
															var error = 'You have filled this leg. Please Re enter the matrix again to keep earning.';
															//create 0 variables for the earning section.
															res.render('dashboard', {title: 'DASHBOARD', admin: admin, a: legs.a, b: legs.b, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, news: news, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus, message: error});
														}
														else{
															//check if the  user has a pending order
															db.query( 'SELECT receiver FROM orders WHERE receiver = ?', [admin], function ( err, results, fields ){
																if( err ) throw err;
																if (results.length === 0){
																	//render the legs
																	res.render('dashboard', {title: 'DASHBOARD', admin: admin, a: legs.a, b: legs.b, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, news: news, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus});
																}else{
																	var info = "Someone wants to pay you!"
																	res.render('dashboard', {title: 'DASHBOARD', admin: admin, a: legs.a, b: legs.b, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, news: news, feederearn: feederearn, total: total, message: info, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus});
																}
															});
														}
													});
												});
											}
										});
									}//end of when user update his profile
								});
							});
						}
					});
				});
			}//end  of news if start else
			else{
				db.query( 'SELECT user FROM admin WHERE user = ?', [currentUser], function ( err, results, fields ){
						if( err ) throw err;
						if( results.length === 0 ){
							//user is not an admin
							db.query( 'SELECT username, full_name FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
								if( err ) throw err;
								var username =  results[0].username;
								var name = results[0].full_name;
								//check if the user has updated his profile
								db.query( 'SELECT user FROM profile WHERE user = ?', [username], function ( err, results, fields ){
									if( err ) throw err;
									if( results.length === 0 ){
										var error = 'Please update your profile to see your stats.';
										res.render( 'dashboard', {title: 'DASHBOARD', error: error});
									}else{
										db.query( 'SELECT * FROM feeder WHERE user = ?', [username], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												var message = 'You have not entered the matrix yet. Please enter the matrix';
												var feedentrance = 0; 
												var totalentrance = 0;
												var feederearn = 0;
												var feederbonus  = 0;
												var referral_bonus = 0;
												var total = 0;
												res.render('dashboard', {title: 'DASHBOARD', referral_bonus: referral_bonus,  feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus, message: message});
											}else{
												//if the user has been in the feeder matrix before
												//get his last legs
												var last  = results.slice(-1)[0];
												var legs = {
													a: last.a,
													b: last.b,
													c: last.c
												}
												//check the number of times he has entered the feeder stage
												db.query( 'SELECT COUNT(user) AS number FROM feeder WHERE user = ?', [username], function ( err, results, fields ){
													if( err ) throw err;
													var feedentrance = results[0].number;
													var totalentrance = 0 + feedentrance;
													//get his total earnings
													db.query( 'SELECT SUM(feeder_referral) AS feederbonus, SUM(feederearn) AS feederearn FROM earnings WHERE user = ?', [username], function ( err, results, fields ){
														if( err ) throw err;
														var feederearn = results[0].feederearn;
														var feederbonus = results[0].feederbonus;
														var referral_bonus = 0 + feederbonus;
														var total = referral_bonus + feederearn;
														//check if the last legs are filled or not.
														if(legs.a !== null && legs.b !== null && legs.c !== null){
															//give them the opportunity to reenter matrix.
															var error = 'You have filled this leg. Please Re enter the matrix again to keep earning.';
															//create 0 variables for the earning section.
															res.render('dashboard', {title: 'DASHBOARD', a: legs.a, b: legs.b, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus, message: error});
														}
														else{
															//check if the  user has a pending order
															db.query( 'SELECT receiver FROM orders WHERE receiver = ?', [username], function ( err, results, fields ){
																if( err ) throw err;
																if (results.length === 0){
																	//render the legs
																	res.render('dashboard', {title: 'DASHBOARD', a: legs.a, b: legs.b, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus});
																}else{
																	var info = "Someone wants to pay you!"
																	res.render('dashboard', {title: 'DASHBOARD', a: legs.a, b: legs.b, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, feederearn: feederearn, total: total, message: info, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus});
																}
															});
														}
													});
												});
											}
										});
									}//end of when user update his profile
								});
							});
						}// user is an admin
						else{
							db.query( 'SELECT username, full_name FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
								if( err ) throw err;
								var admin =  results[0].username;
								var name = results[0].full_name;
								//check if the user has updated his profile
								db.query( 'SELECT user FROM profile WHERE user = ?', [admin], function ( err, results, fields ){
									if( err ) throw err;
										if( results.length === 0 ){
										var error = 'Please update your profile to see your stats.';
										res.render( 'dashboard', {title: 'DASHBOARD', news: news, error: error});
									}else{
										db.query( 'SELECT * FROM feeder WHERE user = ?', [admin], function ( err, results, fields ){
											if( err ) throw err;
											if (results.length === 0){
												var message = 'You have not entered the matrix yet. Please enter the matrix';
												var feedentrance = 0; 
												var totalentrance = 0;
												var feederearn = 0;
												var feederbonus  = 0;
												var referral_bonus = 0;
												var total = 0;
												res.render('dashboard', {title: 'DASHBOARD', referral_bonus: referral_bonus,  admin: admin, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, feederbonus: feederbonus, message: message});
											}else{
												//if the user has been in the feeder matrix before
												//get his last legs
												var last  = results.slice(-1)[0];
												var legs = {
													a: last.a,
													b: last.b,
													c: last.c
												}
												//check the number of times he has entered the feeder stage
												db.query( 'SELECT COUNT(user) AS number FROM feeder WHERE user = ?', [admin], function ( err, results, fields ){
													if( err ) throw err;
													var feedentrance = results[0].number;
													var totalentrance = 0 + feedentrance;
													//get his total earnings
													db.query( 'SELECT SUM(feeder_referral) AS feederbonus, SUM(feederearn) AS feederearn FROM earnings WHERE user = ?', [admin], function ( err, results, fields ){
														if( err ) throw err;
														var feederearn = results[0].feederearn;
														var feederbonus = results[0].feederbonus;
														var referral_bonus = 0 + feederbonus;
														var total = referral_bonus + feederearn;
														//check if the last legs are filled or not.
														if(legs.a !== null && legs.b !== null && legs.c !== null){
															//give them the opportunity to reenter matrix.
															var error = 'You have filled this leg. Please Re enter the matrix again to keep earning.';
															//create 0 variables for the earning section.
															res.render('dashboard', {title: 'DASHBOARD', a: legs.a, b: legs.b, c: legs.c, admin:admin, feederbonus: feederbonus, referral_bonus: referral_bonus, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus, message: error});
														}
														else{
															//check if the  user has a pending order
															db.query( 'SELECT receiver FROM orders WHERE receiver = ?', [admin], function ( err, results, fields ){
																if( err ) throw err;
																if (results.length === 0){
																	//render the legs
																	res.render('dashboard', {title: 'DASHBOARD', a: legs.a, b: legs.b, admin: admin, c: legs.c, feederbonus: feederbonus, referral_bonus: referral_bonus, feederearn: feederearn, total: total, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus});
																}else{
																	var info = "Someone wants to pay you!"
																	res.render('dashboard', {title: 'DASHBOARD', a: legs.a, b: legs.b, c: legs.c,admin: admin, feederbonus: feederbonus, referral_bonus: referral_bonus, feederearn: feederearn, total: total, message: info, feedentrance: feedentrance, totalentrance: totalentrance, noenter: message, news: news, feederbonus: feederbonus});
																}
															});
														}
													});
												});
											}
										});
									}//end of when user update his profile
								});
							});
						}
					});
			}		
		});
	});
});

// get password reset
router.get('/reset/:email/:id/:sponsor/:username/:pin',  function (req, res, next){
  var username = req.params.username;
  var email = req.params.email;
  var sponsor = req.params.sponsor;
  var id =  req.params.id;
  var pin = req.params.pin;
  //get username
    db.query('SELECT username FROM user WHERE username = ? and email = ? and user_id = ? and sponsor = ? ', [username, email, id, sponsor], function(err, results, fields){
      if (err) throw err;
      if (results.length === 0){
      		var error = 'Sorry, your link is invalid. kindly check your mail just to be sure';
      		console.log( error )
       	res.render('passwordreset', {title: 'PASSWORD RESET FAILED', error: error});
	  }else{
			db.query('SELECT code FROM reset WHERE status = ? AND user = ?', ['active', username], function(err, results, fields){
				if (err) throw err;
				if (results.length === 0){
					var error = 'Sorry you have an invalid link or the link your link might be expired.';
					console.log( error )
					res.render('passwordreset', {title: 'PASSWORD RESET FAILED', error: error});
				}else{
					var hash = results[0].code;
					bcrypt.compare(pin, hash, function(err, response){
						if (response !== true){
						var error = 'Your link is invalid';
						console.log( error )
							res.render('passwordreset', {title: 'PASSWORD RESET FAILED', error: error});
								}else {
									db.query( 'UPDATE reset SET status = ?, password = ? WHERE user = ?',['expired', 'qualified', username], function ( err, results, fields ){
											if( err ) throw err;
											
												var message = 'Email verified successfully you can now edit your password now ';
												
										console.log( message );	res.render( 'reset', {title: "PASSWORD RESET", message: message });
							
							});
						}
					});
				}
			});
		}
	});
});

// get verify
router.get('/verify/:username/:email/:phone/:code/:pin',  function (req, res, next){
  var username = req.params.username;
  var email = req.params.email;
  var code = req.params.code;
  var phone = req.params.phone;
  var pin = req.params.pin;
  //get username
    db.query('SELECT username FROM user WHERE username = ? and email = ? and phone = ? and code = ? ', [username, email, phone, code], function(err, results, fields){
      if (err) throw err;
      if (results.length === 0){
      		var error = 'Sorry, your link is invalid. kindly check your mail just to be sure';
      		console.log( error )
       	res.render('verify', {title: 'VERIFICATION FAILED' , error: error});
	  }else{
			db.query('SELECT code FROM verify WHERE status = ? AND user = ?', ['active', username], function(err, results, fields){
				if (err) throw err;
				if (results.length === 0){
					var error = 'Sorry you have an invalid link or the link your link might be expired.';
					console.log( error )
					res.render('verify', {title: 'VERIFICATION FAILED' , error: error});
				}else{
					var hash = results[0].code;
					bcrypt.compare(pin, hash, function(err, response){
						if (response !== true){
						var error = 'Your link is invalid';
						console.log( error )
							res.render('verify', {title: 'VERIFICATION FAILED' , error: error});
								}else {
									db.query( 'UPDATE verify SET status = ? WHERE user = ?',['expired', username], function ( err, results, fields ){
											if( err ) throw err;
											db.query( 'UPDATE user SET verification = ? WHERE username = ?',['yes', username], function ( err, results, fields ){
												if( err ) throw err;
												var message = 'Email verified successfully you can now log in now  ';
												
										console.log( message );	res.render( 'verify', {title: "EMAIL VERIFICATION", message: message });
								});
							});
						}
					});
				}
			});
		}
	});
});
		 
		 
function restrict(x, y, res){
	var currentUser = x
	//the db query
	db.query( 'SELECT user FROM admin WHERE user  = ?', [currentUser], function ( err, results, fields ){ 
		if( err ) throw err;
		if( results.length === 0 ){
		console.log( 'user not an admin' )
			res.redirect( '404' )
		}
		else{
			var route = y;
			console.log( route )
			//res.redirect( route )
			//return currentUser;
		}
	});
}
function admini(x){
	db.query( 'SELECT user FROM admin WHERE user  = ?', [x], function ( err, results, fields ){ 
		if( err ) throw err;
		if( results.length === 0 ){
			console.log( 'not admin' );
		}
		else{
			var admin = x;
			return admin;
		}
	});
}

// get password reset
router.get('/passwordreset',  function (req, res, next){
  res.render('passwordreset', {title: "PASSWORD RESET"});
});

// get verification
router.get('/manage', ensureLoggedIn('/login'), function (req, res, next){
	  var currentUser = req.session.passport.user.user_id;
	  db.query( 'SELECT user FROM admin WHERE user  = ?', [currentUser], function ( err, results, fields ){ 
			if( err ) throw err;
			if( results.length === 0 ){
				res.status( 404 ).render('404', {title: 'SORRY THIS PAGE DOES NOT EXIST.'});
			}
			else{
			var admin = currentUser;
				//check number of admins
				db.query( 'SELECT COUNT(*) AS amount FROM admin ', function ( err, results, fields ){ 
					if( err ) throw err;
					var amount = results[0].amount;
					//check amount of users
					db.query( 'SELECT COUNT(*) AS amount FROM user ', function ( err, results, fields ){ 
						if( err ) throw err;
						var number = results[0].amount;
						
													//check paid
						res.render( 'manage', {title: 'MANAGE USERS', number: number,  admin: admin, amount: amount});
						
					});
				});
			}
 	});
});


// get terms and conditions
router.get('/terms', function (req, res, next) {
  res.render('terms', {title: "TERMS AND CONDITIONS"});
});

// get status
router.get('/status', function (req, res, next) {
  res.render('status');
});

//all users
router.get('/allusers', ensureLoggedIn('/login'), function  (req, res, next) {
		var currentUser = req.session.passport.user.user_id;
		var route = req.route.path;
		restrict( currentUser, route, res )
	    db.query('SELECT * FROM user', function(err, results, fields){
    		 if (err) throw err;
    		 var user = results;
    		 db.query('SELECT * FROM admin', function(err, results, fields){
    		 	if (err) throw err;
    		 	var admin = results;
  				res.render('allusers', {title: 'ALL USERS', admin: admin, users: user});
  			});
  });
});

//all pending payments
/*router.get('/pending', authentificationMiddleware(), function  (req, res, next) {
		var currentUser = req.session.passport.user.user_id;
		var route = req.route.path;
		restrict( currentUser, route, res )
	    db.query('SELECT * FROM withdraw WHERE status = ?', ['pending'], function(err, results, fields){
    		 if (err) throw err;
    		 var pending = results;
    		 db.query('SELECT * FROM withdraw WHERE status = ?', ['paid'], function(err, results, fields){
    		 	if (err) throw err;
    		 	var paid = results;
    		 	var admin = 'for admin'
  				res.render('pending', {title: 'PAYMENTS', admin: admin, pending: pending, paid: paid});
  			});
  });
});*/


//get register with referral link 
/*
router.get('/:username', function(req, res, next) {
  const db = require('../db.js');
  var username = req.params.username;
    //get the sponsor name on the registration page
    db.query('SELECT username FROM user WHERE username = ?', [username],
    function(err, results, fields){
      if (err) throw err;
      if (results.length === 0){
      		console.log('not a valid sponsor name');
       	res.redirect('/');
       // req.flash( 'error', error.msg);
       // res.render( '/register')
      }else{
        var sponsor = results[0].username;
        console.log(sponsor)
        if (sponsor){
          console.log(JSON.stringify(sponsor));
          res.render('index', { title: 'SWIFT REVOLVER', sponsor: sponsor });
        }     
      }
    });  
});*/

//get register with referral link
router.get('/register/:username', function(req, res, next) {
  const db = require('../db.js');
  var username = req.params.username;
    //get the sponsor name on the registration page
    db.query('SELECT username FROM user WHERE username = ?', [username],
    function(err, results, fields){
      if (err) throw err;
      if (results.length === 0){
      		console.log('not a valid sponsor name');
       	res.render('register', {title: 'REGISTRATION'});
       // req.flash( 'error', error.msg);
       // res.render( '/register')
      }else{
        var sponsor = results[0].username;
        console.log(sponsor)
        if (sponsor){
          console.log(JSON.stringify(sponsor));
          res.render('register', { title: 'REGISTRATION', sponsor: sponsor });
        }     
      }
    });  
});

//register get request
router.get('/register', function(req, res, next) {	
    res.render('register',  { title: 'REGISTRATION'});
});

//get login
router.get('/login', function(req, res, next) {  
	const flashMessages = res.locals.getMessages( );
	if( flashMessages.error ){
		res.render( 'login', {
			title: 'LOGIN',
			showErrors: true,
			errors: flashMessages.error
		});
	}else{
		res.render('login', { title: 'LOG IN'});
	}
});

//get referrals
router.get('/referrals', ensureLoggedIn('/login'), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
 // var admin = admini( currentUser )
  //get sponsor name from database to profile page
  db.query('SELECT full_name, code, username, phone FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
		db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    if ( results.length === 0 ){
    	db.query('SELECT sponsor FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    var sponsor = results[0].sponsor;
    db.query('SELECT username FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err;
      //get the referral link to home page
      //var website = "localhost:3002/";
      var user = results[0].username;
      var reg = "/register/";
      var link = user;
      var register = reg + user;
      db.query('SELECT * FROM user WHERE sponsor = ?', [user], function(err, results, fields){
        if (err) throw err;
        //console.log(results)
        res.render('referrals', { title: 'Referrals', register: register, referrals: results, sponsor: sponsor, link: link});
      });
    });
  });
    }else{
    	var admin = currentUser;
    	db.query('SELECT sponsor FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    var sponsor = results[0].sponsor;
    db.query('SELECT username FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err; 
      //get the referral link to home page
      //var website = "localhost:3002/";
      var user = results[0].username;
      var reg = "/register/";
      var link = user;
      var register = reg + user;
      db.query('SELECT * FROM user WHERE sponsor = ?', [user], function(err, results, fields){
        if (err) throw err;
        //console.log(results)
        res.render('referrals', { title: 'Referrals', admin: admin, register: register, referrals: results, sponsor: sponsor, link: link});
      });
    });
  });
    }
  });
  });
});
 

//get logout
router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.post( '/password', function ( req, res, next ){
	var currentUser = req.session.passport.user.user_id;
	  req.checkBody('password1', 'Password must match').equals(req.body.password2);
  req.checkBody('password1', 'Password must be up to 8 characters').len(8);
    var errors = req.validationErrors();

  if (errors) { 
    console.log(JSON.stringify(errors));
    res.render('profile', { title: 'PASSWORD UPDATE FAILED', errors: errors});
  }
  else {
    var password = req.body.password;
    var pass1 = req.body.password1;
    var pass2 = req.body.password2;
    //check if password is correct
    db.query( 'SELECT password FROM user WHERE user_id = ?', [currentUser], function( err, results, fields ){
    	if( err) throw err;
    	var hash  = results[0].password;
    bcrypt.compare(password, hash, function(err, response){
        if(response !== true){
        var error = "Password is not correct";
          res.render('profile', { title: 'Password Update failed', error: error});
        }else{
        	//hash and  save
        	bcrypt.hash(pass1, saltRounds, null, function(err, hash){
							db.query( 'UPDATE user SET password = ? WHERE user_id = ?', [  hash, currentUser], function(err, result, fields){
								if (err) throw err;
								var success = 'Password update successful';
								res.render( 'profile', {success: success, title: 'Password Updated'});
								});
							});
        } 
        });
       });
   }
});

router.post('/sendmail',  function (req, res, next){
	var mail = req.body.mail;
	var subject = req.body.subject;
	var sendma = require( '../nodemailer/mail.js' ); 
	db.query( 'SELECT email, full_name FROM user', function ( err, results, fields ){
		if(err) throw err
		//var users = results;
		//loop to get the emails
		var i = 0;
		while(i < results.length){
		var email = results[i].email;
		var fullname = results[i].full_name;
			sendma.sendmail( email, mail, subject, fullname);
			var info = 'Message Sent to ';
			var success = info + email;
			console.log( success )
		i++;
		}
		res.render( 'status', {success: success});
	});
});

// add news
router.post('/addnews', function (req, res, next){
	var subject = req.body.subject;
	var texts = req.body.texts;
	//delete the ones in the info table.
	db.query('DELETE FROM info', function(err, results, fields){
		if (err) throw err;
		//add to the news table
		db.query('INSERT INTO news (subject, text) VALUES (?,?)', [subject, texts], function(err, result, fields){
			if (err) throw err;
			var success = 'news added successfully';
			res.render('status', {success: success});
		});
	});
});

//post search order
router.post('/searchorder', function (req, res, next){
	var id = req.body.orderId;
	//get it first
	db.query('SELECT * FROM orders WHERE id = ?', [id], function(err, results, fields){
		if( err ) throw err;
		if( results.length === 0 ){
			var error = 'No such order id exist. please check again.';
			res.render( 'status', {error:error} );
		}else{
		var order = {
			name: results[0].fullname,
			payer: results[0].payer,
			receiver: results[0].receiver,
			phone: results[0].phone,
			code: results[0].code,
			//user: results[0].user,
			bank: results[0].bank,
			accountName: results[0].accountName,
			accountNumber: results[0].accountNumber, 
			date: results[0].date
		}
		//interprete it to the success variable
		var success  = 'Account Name: ' + order.accountName + 'Phone Number: ' + order.code + order.phone + 'Account Number: ' + order.account_number + 'Date: ' + order.date + 'Receiver: ' + order.receiver + 'Payer: ' + order.payer + 'Full name: ' + orders.fullname;
		res.render( 'status', {success: success} );
		}
	});
});

//delete admin
router.post('/deladmin', function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			res.render('status', {error: error });
		}
		else{
			db.query('SELECT user FROM admin WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					var error = 'Sorry this admin does not exist.'
				}
				else {
					db.query('DELETE FROM admin WHERE user = ?', [user], function(err, results, fields){
						if( err ) throw err;
						var success = 'Admin deleted successfully!'
						res.render('status', {success: success });
					});
				}
			});
		}
	});
});
//add new admin
router.post('/addadmin', function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			res.render('status', {error: error });
		}
		else{
			db.query('SELECT user FROM admin WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					db.query('INSERT INTO admin ( user ) values( ? )', [user], function(err, results, fields){
						if( err ) throw err;
						var success = 'New Admin Added Successfully!';
						res.render('status', {success: success });
					});
				}
				if( results.length > 0 ){
					var error = 'This user is already an Admin';
					res.render('status', {error: error });
				} 
			});
		}
	});
});
//get profile
router.get('/profile', authentificationMiddleware(), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
  
 db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    if( results.length === 0 ){
    	db.query('SELECT full_name, code, username, phone FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    //console.log(results)
    var bio = {
   	 	fullname: results[0].full_name,
    	code: results[0].code,
    	phone: results[0].phone,
    	username: results[0].username
    }
    //get from profile table
    db.query('SELECT * FROM profile WHERE user = ?', [bio.username], function(err, results, fields){
      if (err) throw err;
      //console.log(results)
      if ( results.length === 0 ){
      		var error = "You have not updated your profile yet."
      		res.render('profile', {title: 'PROFILE', error: error,  phone: bio.phone, code: bio.code, fullname: bio.fullname});
      }else{
      		var prof = {
      		bank: results[0].bank,
      		bank: results[0].account_name,
      		bankname: results[0].account_name,
      		account_number: results[0].account_number
      }
      res.render('profile', {title: 'PROFILE', bank: prof.bank, accountname: prof.account_name, accountnumber: prof.account_number, phone: bio.phone, code: bio.code, fullname: bio.fullname});
      }
    });
  });
    }else{
    	var admin = currentUser;
    	db.query('SELECT full_name, code, username, phone FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    //console.log(results)
    var bio = {
   	 	fullname: results[0].full_name,
    	code: results[0].code,
    	phone: results[0].phone,
    	username: results[0].username
    }
    //get from profile table
    db.query('SELECT * FROM profile WHERE user = ?', [bio.username], function(err, results, fields){
      if (err) throw err;
      //console.log(results)
      if ( results.length === 0 ){
      		var error = "You have not updated your profile yet."
      		res.render('profile', {title: 'PROFILE', error: error,  phone: bio.phone, code: bio.code, fullname: bio.fullname});
      }else{
      		var prof = {
      		bank: results[0].bank,
      		bank: results[0].account_name,
      		bankname: results[0].account_name,
      		account_number: results[0].account_number
      }
      res.render('profile', {title: 'PROFILE', bank: prof.bank, accountname: prof.account_name, accountnumber: prof.account_number, phone: bio.phone, admin: admin, code: bio.code, fullname: bio.fullname});
      }
    });
  });
    }
  //get user details to showcase
  });
});

// post password reset
router.post('/passwordreset',  function (req, res, next){
req.checkBody('username', 'Username must be between 8 to 25 characters').len(8,25);
req.checkBody('email', 'Invalid Email').isEmail();
req.checkBody('email', 'Email must be between 8 to 105 characters').len(8,105);
var errors = req.validationErrors();

  if (errors) { 
    console.log(JSON.stringify(errors));
  res.render('passwordreset', {title: "RESET PASSWORD FAILED", error: errors});
  }else{
  	var username = req.body.username;
  	var email = req.body.email;
  	db.query( 'SELECT username, email FROM user WHERE username = ? AND email = ?', [username, email], function ( err, results, fields ){
  		if( err ) throw err;
  		if( results.length === 0 ){
  			var error  = 'Sorry, We could not find your account';
  			res.render('passwordreset', {title: "RESET PASSWORD FAILED", error: error});
  		}else{
  			var username = results[0].username;
  			var email = results[0].email;
  			var success = 'Great! We found your account! Your email is ' + email + ' while your username is ' + username + '  Check your mail for a confirmation mail. If you do not find it in your inbox, check your spam.';
  			//function to send mail here
  			reset.sendreset( username, email );
  			res.render('passwordreset', {title: "RESET PASSWORD", success: success});
  		}
 	 })
  }
});


//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});

//pinset( )
//get function for pin and serial number
/*function pinset(){
var maiyl = require( '../nodemailer/pin.js' );
  var charSet = new securePin.CharSet(); 
  charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
  securePin.generatePin(10, function(pin){
    console.log("Pin: AGS"+ pin);
    securePin.generateString(10, charSet, function(str){
      console.log(str);
	  var pinn = 'AGS' + pin;
	  exports.pinn = pinn;
     bcrypt.hash(pinn, saltRounds, null, function(err, hash){
        pool.query('INSERT INTO pin (pin, serial) VALUES (?, ?)', [hash, str], function(error, results, fields){
          if (error) throw error;
          exports.str = str;
          //console.log(results)
          //the function to send mail
         //var mail =   'Sageabraham4@gmail.com';
         var mail = 'mify1@yahoo.com';
         maiyl.sendpin( mail,pinn, str ); 
        });
      });
    });
  });
}
pinset(  )*/
//authentication middleware snippet 
function authentificationMiddleware(){
  return (req, res, next) => {
    console.log(JSON.stringify(req.session.passport));
  if (req.isAuthenticated()) return next();

  res.redirect('/login'); 
  } 
}
/*function admin( req ){
	var currentUser = req.session.passport.user.user_id;
	//check if the user is in the admin section.
	db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
		if( err ) throw err;
		if( results.length === 0 ){
			console.log( 'not an admin' );
		}
		else{
			var adm = results[0].user;
			return adm
		}
	});
}
var admin = admin(  );*/ 
//post withdraw
/*router.post('/withdraw',  function (req, res, next){
	var currentUser = req.session.passport.user.user_id;
	//use the user username
	db.query('SELECT username FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
		if( err ) throw err;
		var username = results[0].username;
	//check if the user has transactions.
		db.query('SELECT balance FROM transactions WHERE user = ?', [username], function(err, results, fields){
   		   if (err) throw err;
   		   //console.log( results );
   		   if (results.length ===0){
   		   		var error = 'Insufficient funds';
   		   		res.render( 'status', {error: error});
   		   }else{
   		   		//check where there is no debit but loop first.
   		  	 	var i = 0;
   		  	 	var last =  results.slice( -1 )[0];
   		  	 	var balance = last.balance;
   		  	 	if( balance === 0 ){
   		  	 		var error = 'insufficient funds';
   		  	 		res.render( 'status', {error: error});
   		  	 	}else{
   		  	 	//call the withdraw funds.
   		  	 		db.query( 'CALL debit(?,?)', [username, balance], function ( err, results, fields ){
   		  	 			 var success = 'Withdraw Successful!'
   		   				if( err ) throw err;
   		   				res.render( 'status', {success: success});
   		   			});
   		  	 	}
   		   }
  		});
  	});
});*/

router.post('/pay', function (req, res, next) {
  var user = req.body.user;
  var id = req.body.id;
  //check if the user has pending payments
  db.query('SELECT * FROM withdraw WHERE user = ? and status = ?', [user, 'pending'], function(err, results, fields){
		if ( err ) throw err;
		if( results.length === 0 ){
			var error = 'Sorry, this user do not have pending payments. Search this user transaction history and check the pending payments for more information';
			res.render( 'status', {error: error});
		}
		else{
			//update to paid
			db.query('UPDATE withdraw SET status = ? WHERE user = ?', ['paid', user], function(error, results, fields){
        	  if (error) throw error;
        	  db.query('UPDATE transactions SET debit_receipt = ? WHERE user = ?', [id, user], function(error, results, fields){
        	  if (error) throw error;
        	  var success = 'Payment recorded'
			res.render( 'status', {success: success});
          	});
          });
		}
	});
});

router.post('/confirmfeederpayment/:order_id/id/:user', function (req, res, next){
	var orderId = req.params.order_id;
	var id = req.params.id;
	var user = req.params.user;
	var currentUser = req.session.passport.user.user_id;
	//update the id to confirmed.
	db.query('UPDATE orders SET status = ? WHERE id = ?', ['confirmed', id], function(error, results, fields){
		if (error) throw error;
		//check if the second one is confirmed or not.
		db.query('SELECT order_id, purpose, status FROM orders WHERE order_id = ? and not status = ?', [orderId, 'confirmed'], function(error, results, fields){
			if( err )throw err;
			if (results.length === 0){
				res.redirect('/orders');
			}else{
				//update the user as confirmed
				db.query('UPDATE feeder SET status = ? WHERE order_id = ?', ['confirmed', orderId], function(error, results, fields){
					if (error) throw error;
					//check where the purpose is.
					db.query('SELECT purpose FROM orders WHERE order_id = ? and (purpose = ? or purpose = ? or purpose = ?)', [orderId, 'user penalty', 'referral bonus', 'matrix entrance'], function(error, results, fields){
						if( err )throw err;
						var purpose = results[0].purpose;
						if (purpose === 'referral bonus'){
							//check if the user has earned before
							db.query('SELECT user FROM earnings WHERE user_id = ?', [currentUser], function(error, results, fields){
								if( err )throw err;
								if (results.length === 0){
									//select the username
									db.query('SELECT username FROM user WHERE user_id = ?', [currentUser], function(error, results, fields){
										if( err )throw err;
										var username = results[0].username;
										//insert it here.
										db.query('INSERT INTO earnings (user, user_id, feederbonus) VALUES (?, ?, ?)', [username, currentUser, 4000], function(error, result, fields){
											if (error) throw error;
										});
									});
								}else{
									//update the amount with stored procedure.
									db.query('CALL feederbonus(?)', [currentUser], function(error, results, fields){
										if (error) throw error;
										res.redirect('/orders');
									});
								}
							});
						}if (purpose === 'matrix entrance'){
							//check if the user has earned before
							db.query('SELECT user FROM earnings WHERE user_id = ?', [currentUser], function(error, results, fields){
								if( err )throw err;
								if (results.length === 0){
									//select the username
									db.query('SELECT username FROM user WHERE user_id = ?', [currentUser], function(error, results, fields){
										if( err )throw err;
										var username = results[0].username;
										//insert it here.
										db.query('INSERT INTO earnings (user, user_id, feederearn) VALUES (?, ?, ?)', [username, currentUser, 4000], function(error, result, fields){
											if (error) throw error;
										});
									});
								}else{
									//update the amount with stored procedure.
									db.query('CALL feederearn(?)', [currentUser], function(error, results, fields){
										if (error) throw error;
										res.redirect('/orders');
									});
								}
							});
						}if (purpose === 'user penalty'){
							//function to execute.
						}
					});
				});
			}
		});
	});
});

router.post('/reset', function(req, res, next) {
	req.checkBody('password', 'Password must be between 8 to 25 characters').len(8,100);
  req.checkBody('cpass', 'Password confirmation must be between 8 to 100 characters').len(8,100);
  req.checkBody('password', 'Password must match').equals(req.body.cpass);
  var errors = req.validationErrors();
	if (errors) { 
		
  	  console.log(JSON.stringify(errors));
  	  
  	  res.render('reset', { title: 'PASSWORD RESET  FAILED', errors: errors});
	  }else{
  			var cpass = req.body.cpass;
			var password = req.body.password;
			var username = req.body.username;
			db.query('SELECT username FROM reset WHERE password = ? and username = ?', ['qualified', username], function(error, results, fields){
				if( err )throw err;
				if( results.length === 0 ){
					var error = "Please confirm your username... it isn't correct.";
					res.render('reset', { title: 'PASSWORD RESET  FAILED', error: error});
				}
				else{
					bcrypt.hash(password, saltRounds, null, function(err, hash){
						db.query('UPDATE user SET password = ? WHERE username = ?', [hash, username], function(error, results, fields){
        			  		if (error) throw error;
        			  		var success = 'Password changed successfully!';
          				res.render( 'reset',{success: success} ); 
        				});
					});
				}
			});
		 }
	 });
	
router.post('/search', function  (req, res, next) {
		var currentUser = req.session.passport.user.user_id;
		var route = req.route.path;
		restrict( currentUser, route, res )
	var username = req.body.username;
	db.query('SELECT * FROM user WHERE username = ?', [username], function(err, results, fields){
		if ( err ) throw err;
		if( results.length === 0 ){
			var error = 'invalid user';
			res.render( 'status', {error: error});
		}
		else{
			db.query('SELECT * FROM transactions WHERE user = ?', [username], function(err, results, fields){
				if ( err ) throw err;
				if( results.length === 0 ){
					var error  = 'This user has not earned yet.';
					res.render( 'status', {error: error});
				}else{
					var user = results;
					res.render( 'test', {user: user});
				}
			});
		}
	});
});


/*router.post('/debit', function(req, res, next) {
	var username =  req.body.username;
	var amount = req.body.amount;
	var funds = req.body.funds;
	db.query('SELECT username FROM users WHERE user = ?', [username], function(err, results, fields){
		if ( err ) throw err;
		if( results.length === 0 ){
			var error = 'User does not extist.';
			res.render('manage',  { title: 'Manage Users', error: error,  transactions: results});
		}else{
			//check his available balance
			db.query('SELECT * FROM transactions WHERE user = ?', [username], function(err, results, fields){
			if ( err ) throw err;
				if( results.length === 0 ){
					var error = 'insufficient funds';
					res.render('manage',  { title: 'Manage Users', error: error,  transactions: results});
				}
				else{
					//check if he has up to that amount
					var last = results.slice( -1 )[0];
					var bal = last.balance;
					if ( bal < amount ){
						var error = 'insufficient funds';
							res.render('manage',  { title: 'Manage Users', error: error,  transactions: results});
					}
					else{
						db.query( 'CALL debit( ? )' , [username], function ( err, results, fields ){
							if( err ) throw err;
							var success = 'success';
							res.render('manage',  { title: 'Manage Users', success: success,  transactions: results});
						});
					}
				}
			});
		}
	res.render('manage',  { title: 'Manage Users', transactions: results});
	});
});*/


//post log in
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successReturnToOrRedirect: '/dashboard',
  failureFlash: true
}));

//post profile
router.post('/profile', function(req, res, next) {
  console.log(req.body) 
  req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
  //req.checkBody('email', 'Email must be between 8 to 25 characters').len(8,25);
 // req.checkBody('email', 'Invalid Email').isEmail();
  req.checkBody('code', 'Country code must not be empty.').notEmpty();
  req.checkBody('account_number', 'Account Number must not be empty.').notEmpty();
  req.checkBody('phone', 'Phone Number must be ten characters').len(10);
  //req.checkBody('pass1', 'Password must have upper case, lower case, symbol, and number').matches(/^(?=,*\d)(?=, *[a-z])(?=, *[A-Z])(?!, [^a-zA-Z0-9]).{8,}$/, "i")
 
  var errors = req.validationErrors();

  if (errors) { 
    console.log(JSON.stringify(errors));
    res.render('profile', { title: 'UPDATE FAILED', errors: errors});

  }
  else {
    var password = req.body.password;
    //var email = req.body.email;
    var fullname = req.body.fullname;
    var code = req.body.code;
    var phone = req.body.phone;
    var bank = req.body.bank;
    var accountName = req.body.AccountName;
    var accountNumber = req.body.account_number;
    var currentUser = req.session.passport.user.user_id;

    //get sponsor name from database to profile page
    pool.query('SELECT password, username FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err;
      const hash = results[0].password;
      var username = results[0].username;
      //compare password
      bcrypt.compare(password, hash, function(err, response){
        if(response !== true){
        var error = "Password is not correct";
          res.render('profile', { title: 'Profile Update failed', error: error});
        }else{
              //update user
              pool.query('UPDATE user SET full_name = ?, code = ?, phone = ? WHERE user_id = ?', [fullname, code, phone, currentUser], function(err, results,fields){
                if (err) throw err;

                //check if user has updated profile before now
                pool.query('SELECT user FROM profile WHERE user = ?', [username], function(err, results, fields){
                  if (err) throw err;
      
                  if (results.length===0){
                    pool.query('INSERT INTO profile (user, bank, account_name, account_number) VALUES (?, ?, ?, ?)', [username, bank, accountName, accountNumber], function(error, result, fields){
                      if (error) throw error;
					  var success = 'Update Successful!'
                      res.render('profile', {title: "UPDATE SUCCESSFUL", success: success});  
                    });
                  }else{
                    pool.query('UPDATE profile SET bank = ?, account_name = ?, account_number = ? WHERE user = ?', [bank, accountName, accountNumber, username], function(err, results,fields){
                      if (err) throw err;
                      var success = " Update Successful!";
                      console.log(results);
                      res.render('profile', {title: "UPDATE SUCCESSFUL", success: success});  
                    });
                  }
                });
              });
        }
      });
    });
  }
});

//post the register
//var normal = require( '../functions/normal.js' );
router.post('/register', function (req, res, next) {
	//export the req, res and next
	//exports.res = res;
	console.log(req.body) 
  req.checkBody('sponsor', 'Sponsor must not be empty').notEmpty();
  req.checkBody('sponsor', 'Sponsor must be between 8 to 25 characters').len(8,25);
  req.checkBody('username', 'Username must be between 8 to 25 characters').len(8,25);
  req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
  req.checkBody('pass1', 'Password must be between 8 to 25 characters').len(8,100);
  req.checkBody('pass2', 'Password confirmation must be between 8 to 100 characters').len(8,100);
  req.checkBody('email', 'Email must be between 8 to 105 characters').len(8,105);
  req.checkBody('email', 'Invalid Email').isEmail();
  req.checkBody('code', 'Country Code must not be empty.').notEmpty();
  req.checkBody('pass1', 'Password must match').equals(req.body.pass2);
  req.checkBody('phone', 'Phone Number must be ten characters').len(10);
  //req.checkBody('pin', 'Pin must be thirteen characters').len(13);
  //req.checkBody('serial', 'Serial must be ten characters').len(10);
  /*req.checkBody('pass1', 'Password must have upper case, lower case, symbol, and number').matches((?=,*\d)(?=, *[a-z])(?=, *[A-Z])(?!, [^a-zA-Z0-9]).{8,}$/, "i")*/
  var username = req.body.username;
    var password = req.body.pass1;
    var cpass = req.body.pass2;
    var email = req.body.email;
    var fullname = req.body.fullname;
    var code = req.body.code;
    var phone = req.body.phone;
	var sponsor = req.body.sponsor;
	
  var errors = req.validationErrors();
	if (errors) { 
		
  	  console.log(JSON.stringify(errors));
  	  
  	  res.render('register', { title: 'REGISTRATION FAILED', errors: errors, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code, sponsor: sponsor});
  }else{
	//var pin = req.body.pin;
	//var serial = req.body.serial;

    var db = require('../db.js');
    //check if sponsor is valid
    db.query('SELECT username, full_name, email FROM user WHERE username = ?', [sponsor], function(err, results, fields){
      if (err) throw err;
      if(results.length===0){
        var error = "This Sponsor does not exist";
        //req.flash( 'error', error)
        console.log(error);
        res.render('register', {title: "REGISTRATION FAILED", error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code,   sponsor: sponsor});
      }else{
      		db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
          	if (err) throw err;
          	if(results.length===1){
          		var error = "Sorry, this username is taken";
            		console.log(error);
            		res.render('register', {title: "REGISTRATION FAILED", error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code,  sponsor: sponsor});
          	}else{
          		db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
          			if (err) throw err;
          			if(results.length===1){
          				var error = "Sorry, this email is taken";
            				console.log(error);
            		}else{
            				
						bcrypt.hash(password, saltRounds, null, function(err, hash){
							db.query( 'CALL register(?, ?, ?, ?, ?, ?, ?, ?, ?)', [ sponsor, fullname, phone, code, username, email, hash, 'active', 'no'], function(err, result, fields){
								if (err) throw err;
								db.query( 'SELECT amount from user where username  = ?', [ sponsor], function ( err, results, fields ){
									if( err )throw err;
									var amount = results[0].amount;
									db.query( 'UPDATE user SET amount = ? WHERE username = ?', [amount + 1, sponsor], function( err, results, fields ){
										if( err )throw err;
										var success = 'Your registration was successful. Please check your mail for a confirmation message i you do not see it, check your spam.';
										reset.sendverify( username, email, code, password );
										reset.newreferral( sponsor, username, email );
										res.render('register', {title: 'REGISTRATION SUCCESSFUL!', success: success});
									});
								});
							});
						});
					 
					}
          		});
          	}
          });
      }
    });
  }
});
//post cancel button for news.
router.post('/newsc', function (req, res, next){
	var currentUser = req.session.passport.user.user_id;
	//get the news.
	//var news = req.body.news;
	db.query( 'SELECT subject FROM news', function ( err, results, fields ){
		if( err ) throw err;
		var last = results.slice( -1 )[0];
		var news  = last.subject;
	//enter into the info database.
	db.query('INSERT INTO info (user, subject) VALUES (?, ?)', [currentUser, news], function(err, results, fields){
		if (err) throw err;
		res.redirect('dashboard');
		});
	});
});
//post join request
router.post('/feeder', function (req, res, next) {
	var countDown= new Date("Feb 18,  2019 10:00:00").getTime(  );
	var now = new Date().getTime(  );
	var distance = countDown - now;
	var days = Math.floor(distance /(1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	if( distance > 0 ){
		var error  = 'We are yet to launch... try again';
		res.redirect( 'dashboard');
	}else{
	var currentUser = req.session.passport.user.user_id;
	//get the username.
	db.query( 'SELECT username FROM user WHERE user_id = ?', [currentUser], function( err, results, fields ){
		if( err )throw err;
		var username = results[0].username;
		//check for the sponsor
		db.query( 'SELECT sponsor FROM user WHERE username = ?', [username], function( err, results, fields ){
			if( err )throw err;
			var sponsor = results[0].sponsor;
			matrix.nospon(username, sponsor, res);
			});
		});
	}
});
//get error handler for unauthorized
router.get('/unauthorized', function(req, res){
	res.status( 401).render('404', {title: 'YOU DO NOT HAVE PERMISSION TO VIEW THIS PAGE.'});
});
//get error handler
router.get('*', function(req, res){
	res.status( 404 ).render('404', {title: 'SORRY THIS PAGE DOES NOT EXIST.'});
});
module.exports = router;