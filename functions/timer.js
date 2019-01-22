/*exports.count = function count( ){
	var countDown= new Date("Nov  14,  2018 10:00:00").getTime(  );
	var now = new Date().getTime(  );
	var distance = countDown - now;
	var days = Math.floor(distance /(1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	if( distance > 0 ){
		var error  = 'We are yet to launch... try again';
		res.redirect( 'dashboard' )
	}
}*/


//code the first 45 minutes timer.
exports.firstcount = function firstcount( ){
	//get the time they were entered from the database
	db.query('SELECT date_entered FROM orders', function(err, results, fields){
		if ( err ) throw err;
		if (results.length > 0){
			//loop with while loop.
			var i = 0;
			var now = new Date().getTime();
			while ( i < results.length  ){
				var dates = results[i].date_entered;
				var date = dates.getTime();
				var distance = now - date;
				var dateminutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				if (dateminutes >= 45){
					//make the order inactive incase the user forgot to upload the proof of payment before the time expired.
					//put db procedure here to remove the user from the feeder table.
				}
				i++;
			}
		}
	});
}