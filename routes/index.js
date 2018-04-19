var express = require('express');
var router = express.Router();
var Book = require('../models/Book');
var admin = require("firebase-admin");

var serviceAccount = require("../ddb-mini-project-firebase-adminsdk-h9p83-c071f93522.json");

admin.initializeApp({
 	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://ddb-mini-project.firebaseio.com"
});

var db = admin.firestore();

router.get('/', function(req, res, next) {

	Book.find({}, function(err, techbooks){
		
		var nontechbooks = [];
		var booksRef = db.collection('books');

		var query = booksRef.get()
					.then(snapshot => {
						snapshot.forEach(doc=>{
							nontechbooks.push({
								id: doc.id,
								name: doc.data().name,
								description: doc.data().description,
								author: doc.data().author,
								price: doc.data().price,
								type: doc.data().type
							});
						});
						console.log(nontechbooks);
						console.log(techbooks);
						res.render('index', { techbooks: techbooks, nontechbooks: nontechbooks });
					});
	});
});

router.post('/create', function(req, res, next){
	

	var book = {
		name: req.body.name,
		description: req.body.description,
		author: req.body.author,
		price: req.body.price,
		type: req.body.type
	}

	if(req.body.type == "technical"){

		Book.create(book, function(err, book){
			if(err){
				console.log(err);
			}
		console.log(req.body);
		res.redirect('/');			
		});
	}else{
		var book_id = ""+Math.floor((Math.random() * 100000) + 1);
		var setDoc = db.collection('books').doc(book_id).set(book);
		res.redirect('/');
	}

});

router.post('/delete', function(req, res, next){

	var id = req.body.id;

	Book.remove({ _id: id }, function(err){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});

});

router.post('/deletefirestore', function(req, res, next){

	var id = req.body.id;

	var deleteDoc = db.collection('books').doc(id).delete();
	res.redirect('/');
});

module.exports = router;
