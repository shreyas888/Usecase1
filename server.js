/*---------------------------------------------
 * @Author: Shreyas Bedekar
 * @CreatedOn: 13/04/2015
 * @Modified On:15/04/2015
 * Desc: Server implemtation for Node JS
 ---------------------------------------------*/

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var SERVER_PORT = 8888;
var MONGO_PORT = 27017;

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
  if(~(val.indexOf('mongo'))){
  	val = val.split('=');
  	var port = parseInt(val[1]);
  	if(port != NaN) MONGO_PORT = port;
  }
  if(~(val.indexOf('port'))){
  	val = val.split('=');
  	var port = parseInt(val[1]);
  	if(port != NaN) SERVER_PORT = port;
  }
});

// configuration =================
var fs = require('fs');
var productSchema = mongoose.Schema({
    Id: Number,
    ProductName: String,
    Cost: Number,
    Price: Number,
    Quantity: Number,
    Type: String,
    Brand: String
});


// exports.CollectionDriver = CollectionDriver;

var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('localhost', MONGO_PORT, {auto_reconnect: true});
var db = new Db('inventoryDb', server);

var PRODUCTS = null;
db.open(function(err, db) {
	if(!err) {
		db.collection('products', function(err, collection) {
	    	collection.count(function(err, count) {
	    		//If Products collection is Empty, read data.json and populate collection
	    		if(count === 0){
					var obj = JSON.parse(fs.readFileSync('static/data/data.json', 'utf8'));
					var data = obj['data'];
	      			collection.insert(data);    			
	    		};
	    	});
	    });
	}
});

// set the static files location to static folder
app.use(express.static(__dirname + '/static'));                 
// log every request to the console
app.use(morgan('dev'));                                       
// parse application/x-www-form-urlencoded  (PUT/POST)
app.use(bodyParser.urlencoded({'extended':true}));            
// parse application/json
app.use(bodyParser.json());                                     
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());

// load the single view file (angular will handle the page changes on the front-end)
app.get('/', function(req, res) {
    res.sendfile('static/index.html'); 
});
//All Record from Grid
app.get('/alldata', function(request, response) {
  console.log("I have been hit"); //I Am getting here
  db.collection('products').find().toArray(function(err, docs) {
          console.log("Printing docs from Array");
          response.json(200, {'products': docs});
    });
});

app.get('/search', function(request, response) {
  	console.log("I have been hit"); //I Am getting here
  	var search = new RegExp('.*^' + request.query.name + '.*', 'i');
  	db.collection("products").find({ProductName:search}).toArray(function(err, results) {
	    data = results[0];
	    response.json(200, results);
	});
});

//Save product
app.post('/save', function(request, response) {
	var params = request.body,
	id = parseInt(params.Id);
	msg = 'Product Already Exists';
	//Check if Product Exists
	db.collection("products").find({ProductName:params.ProductName}).toArray(function(err, results) {
		if(results.length == 0 || !params.nameChange){
			//Save Product
			db.collection("products").update({Id:id}, {$set: {ProductName: params.ProductName,Price: parseInt(params.Price) }});
			msg = 'Done';
			response.json(200, msg);
			console.log("I have been Saved");
			return;
		}
		else{
			response.json(200, msg);
			return;
		}
	});
});


//Add new product
app.put('/add', function(request, response) {
	var params = request.body,
	msg = 'Product Already Exists';
	//Check if Product with same name exist
	db.collection("products").find({ProductName:params.ProductName.toString()}).toArray(function(err, results) {
		if(results.length == 0){
			//IF not set Auto Id
			db.collection('products', function(err, collection) {
				collection.count(function(err, count) {
					params['Id'] = count + 1;
					db.collection("products").insert(params);
					msg = 'Done';
					response.json(200, msg);
					console.log("I have been Added");
					return;
					
				});
			});
		}
		else{
			response.json(200, msg);
			return;
		}
	});
});

    
// listen (start app with node server.js) ======================================
app.listen(SERVER_PORT);
console.log("App listening on port " + SERVER_PORT);

