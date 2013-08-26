var rdfstore = require('rdfstore');
var request = require('request');

rdfstore.create(function(store) {

	store.graph(function(success, graph) {
	
	var env = store.rdf;
	
	function createProject(names, url, picture) {
		var product = env.createNamedNode(url);
		//the first name is primary
		graph.add(env.createTriple(product, 
				env.createNamedNode("rdfs:label"),
				env.createLiteral(names[0])));

		//other names are seeAlso-references
		for (var i = 1; i < names.length; i++) {
			var redirect = env.createNamedNode(url + encodeURIComponent(names[i]));
			graph.add(env.createTriple(redirect, 
				env.createNamedNode("rdfs:label"),
				env.createLiteral(names[i])));
			
			graph.add(env.createTriple(redirect,
				env.createNamedNode("rdfs:seeAlso"),
				product));

		}

		graph.add(env.createTriple(product,
			env.createNamedNode("foaf:depiction"),
			env.createNamedNode(picture)));
	}

	createProject(["Apache Clerezza",
	"Semantic Web Platform",
	"ScalaServerPages"],
	"http://clerezza.apache.org/",
	"http://clerezza.apache.org/images/logo.png");
	
	createProject(["Apache Karaf", "OSGi Webconsole"],
	"http://karaf.apache.org/",
	"http://karaf.apache.org/images/karaf-logo.png");
	
	createProject(["Apache Camel",
	"Enterprise Integration Patterns"],
	"http://camel.apache.org/",
	"http://camel.apache.org/images/camel-box-small.png");

	console.log("Uploading the following RDF graph: " + graph.toNT());

	request.post({
		uri: "http://localhost:8081/"+"entityhub/site/apache/entity?update=true",
	
		headers: {"Content-Type": "text/turtle"},
		auth: {
			user: "admin",
			pass: "admin"
			},
		body: graph.toNT()
		},

		function(error, response, body) {
			console.log("response status Code: " + response.statusCode);
			console.log(body);
		});
	});

});