var db = require( '../db.js' );
exports.newrotate = function(y, x){
	//put the person under me directly.
	db.query('SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth FROM rotate AS node, rotate AS parent, rotate AS sub_parent, ( SELECT node.user, (COUNT(parent.user) - 1) AS depth FROM rotate AS node, rotate AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? GROUP BY node.user ORDER BY node.lft) AS sub_tree WHERE node.amount < 3 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.user = sub_tree.user GROUP BY node.user HAVING depth > 0 ORDER BY depth', [y], function(err, results, fields){
		if (err) throw err;
		var rotatedepth = results[0].depth;
		db.query('SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth FROM rotate AS node, rotate AS parent, rotate AS sub_parent, ( SELECT node.user, (COUNT(parent.user) - 1) AS depth FROM rotate AS node, rotate AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? GROUP BY node.user ORDER BY node.lft) AS sub_tree WHERE node.amount = 0 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.user = sub_tree.user GROUP BY node.user HAVING depth > 0 ORDER BY depth', [y], function(err, results, fields){
			if (err) throw err;
			var rotate1 = {
				user: results[0].user,
				entrance: results[0].entrance,
				a: results[0].a,
				b: results[0].b,
				c: results[0].c,
				depth: results[0].depth
			}
			if (rotatedepth === rotate1.depth){
				db.query('UPDATE rotate SET a = ? WHERE user = ?', [x, rotate1.user], function(err, results, fields){
					if(err) throw err;
					//get the users orderid.
					db.query('SELECT order_id FROM orders WHERE payer = ?', [x], function(err, results, fields){
						if ( err ) throw err;
						var order_id = results[0].order_id;
						//insert into the rotational tree.
						db.query('CALL rotateadd VALUES (?, ?, ?)', [order_id, x, rotate1.user], function( err, results, fields ){
							if( err ) throw err;
						});
					});
				});
			}else{
				//check if it is in the b section.
				db.query('SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth FROM rotate AS node, rotate AS parent, rotate AS sub_parent, ( SELECT node.user, (COUNT(parent.user) - 1) AS depth FROM rotate AS node, rotate AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? GROUP BY node.user ORDER BY node.lft) AS sub_tree WHERE node.amount = 1 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.user = sub_tree.user GROUP BY node.user HAVING depth > 0 ORDER BY depth', [y], function(err, results, fields){
					if (err) throw err;
					//check the c if there is no b
					if(results.length === 0){
						//check the c.
						db.query('SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth FROM rotate AS node, rotate AS parent, rotate AS sub_parent, ( SELECT node.user, (COUNT(parent.user) - 1) AS depth FROM rotate AS node, rotate AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? GROUP BY node.user ORDER BY node.lft) AS sub_tree WHERE node.amount = 2 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.user = sub_tree.user GROUP BY node.user HAVING depth > 0 ORDER BY depth', [y], function(err, results, fields){
							if (err) throw err;
							var rotate3 = {
								user: results[0].user,
								entrance: results[0].entrance,
								a: results[0].a,
								b: results[0].b,
								c: results[0].c,
								depth: results[0].depth
							}
							if (rotatedepth === rotate2.depth){
								db.query('UPDATE rotate SET b = ? WHERE user = ?', [x, rotate1.user], function(err, results, fields){
									if(err) throw err;
									//get the users orderid.
									db.query('SELECT order_id FROM orders WHERE payer = ?', [x], function(err, results, fields){
										if ( err ) throw err;
										var order_id = results[0].order_id;
										//insert into the rotational tree.
										db.query('CALL rotateadd VALUES (?, ?, ?)', [order_id, x, rotate1.user], function( err, results, fields ){
											if( err ) throw err;
											//function to rotate again.
										});
									});
								});
							}
						});
					}else{
						//ger the variables
						var rotate2 = {
							user: results[0].user,
							entrance: results[0].entrance,
							a: results[0].a,
							b: results[0].b,
							c: results[0].c,
							depth: results[0].depth
						}
						if (rotatedepth === rotate2.depth){
						db.query('UPDATE rotate SET b = ? WHERE user = ?', [x, rotate1.user], function(err, results, fields){
							if(err) throw err;
							//get the users orderid.
							db.query('SELECT order_id FROM orders WHERE payer = ?', [x], function(err, results, fields){
								if ( err ) throw err;
								var order_id = results[0].order_id;
								//insert into the rotational tree.
								db.query('CALL rotateadd VALUES (?, ?, ?)', [order_id, x, rotate1.user], function( err, results, fields ){
									if( err ) throw err;
								});
							});
						});
					}else{
						db.query('SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth FROM rotate AS node, rotate AS parent, rotate AS sub_parent, ( SELECT node.user, (COUNT(parent.user) - 1) AS depth FROM rotate AS node, rotate AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? GROUP BY node.user ORDER BY node.lft) AS sub_tree WHERE node.amount = 2 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.user = sub_tree.user GROUP BY node.user HAVING depth > 0 ORDER BY depth', [y], function(err, results, fields){
							if (err) throw err;
							var rotate3 = {
								user: results[0].user,
								entrance: results[0].entrance,
								a: results[0].a,
								b: results[0].b,
								c: results[0].c,
								depth: results[0].depth
							}
							if (rotatedepth === rotate2.depth){
								db.query('UPDATE rotate SET b = ? WHERE user = ?', [x, rotate1.user], function(err, results, fields){
									if(err) throw err;
									//get the users orderid.
									db.query('SELECT order_id FROM orders WHERE payer = ?', [x], function(err, results, fields){
										if ( err ) throw err;
										var order_id = results[0].order_id;
										//insert into the rotational tree.
										db.query('CALL rotateadd VALUES (?, ?, ?)', [order_id, x, rotate1.user], function( err, results, fields ){
											if( err ) throw err;
											//function to rotate again.
										});
									});
								});
							}
						});
					}
				}):
			}
		});
	});
}