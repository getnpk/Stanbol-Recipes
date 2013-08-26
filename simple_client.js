var request = require('request');
var fs = require('fs');

fs.createReadStream('testdata.txt').pipe(request.post( {
	//url:'http://localhost:8081/stanbol/enhancer',
	//url:'http://localhost:8081/enhancer/chain/dbpedia-disambiguation',
	url:'http://localhost:8081/enhancer/chain/all-active',
	headers:{accept:'application/json'},
	auth: {
		user:'admin',
		pass:'admin'
	}
	},
	function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('Status okay!');
			enhancements = JSON.parse(body)['@graph']
			console.log(enhancements);
			for (var i = 0; i < enhancements.length; i++) {
				if (enhancements[i]['enhancer:entity-reference']) {
					console.log(enhancements[i]['enhancer:entity-reference'])
				}
			}
		}
		else {
			console.log('Got status code: '+ response.statusCode)
		}
	}
))