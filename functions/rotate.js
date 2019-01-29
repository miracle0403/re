var db = require( '../db.js' );
var putnew = require( './newrotate.js' );
exports.rotate = function(x){
	//check  if the user has entered the rotate matrix before.
	db.query('SELECT * FROM rotate WHERE user = ?', [x], function(err, results, fields){
		if ( err ) throw err;
		if(results.length === 0){
			var putnow = 'Miracle0403';
			//function to put.
			putnew.newrotate(putnow, x);
		}
	});
}