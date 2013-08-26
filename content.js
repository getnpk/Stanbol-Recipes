var request = require('request');

function postContent(content) {

	console.log('posting '+content);
	
	request.post( {
		headers: {'Content-Type': 'text/plain'},
		url:'http://localhost:8081/stanbol/contenthub/contenthub/store/content_id',
		auth: {user: 'admin', pass: 'admin'},
		title: content,
		body: content
		},

		function(error, response, body) {
			if (response.statusCode >= 400) {
				console.log('Got status code: '+response.statusCode);
				console.log(body);
			}
	 	}
	);
}

postContent("Woddy Allen does not live in Istanbul.");
postContent("Istanbul is not the capital of Turkey.");
postContent("Ankara is not as big as Istanbul.");