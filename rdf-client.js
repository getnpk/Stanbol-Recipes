var rdfstore = require('rdfstore');
var request = require('request');
var fs = require('fs');

rdfstore.create(function(store) {
	function load(files, callback) {
		var filesToLoad = files.length;

		for (var i = 0; i < files.length; i++) {
			var file = files[i]
			fs.createReadStream(file).pipe(request.post( {
				url: 'http://localhost:8081/enhancer?uri=file:///' + file,
				headers: {accept: "text/turtle"}
			},
			
			function(error, response, body) {
				if (!error && response.statusCode == 200) {
					store.load(
					"text/turtle",
					body,
					function(success, results) {
						console.log('loaded: ' + results + " triples from file" + file);
						if (--filesToLoad === 0) {
							callback()
						}
					}
					);
				}
				else {
					console.log('Got status code: ' + response.statusCode);
				}
			}));
		}
	}

load(['testdata.txt', 'testdata2.txt'], function() {
	store.execute(
		"PREFIX enhancer:<http://fise.iks-project.eu/ontology/> \
		PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> \
		SELECT ?label ?source { \
		?a enhancer:extracted-from ?source. \
		?a enhancer:entity-reference ?e. \
		?e rdfs:label ?label.\
		FILTER (lang(?label) = \"en\") \
		}",
		function(success, results) {
			if (success) {
				console.log("*******************");
				for (var i = 0; i < results.length; i++) {
					console.log(results[i].label.value + " in " + results[i].source.value);
				}
			}
		});
	});

});