var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var Profil = mongoose.model('Profils');

//Used for routes that must be authenticated.
isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	res.redirect('/#/login');
};

router.use('/posts', isAuthenticated);

router.route('/posts')
	//creates a new post
	.post(function(req, res){

		var post = new Post();
		post.text = req.body.text;
		post.created_by = req.body.created_by;
		post.save(function(err, post) {
			if (err){
				return res.send(500, err);
			}
			return res.json(post);
		});
	})
	//gets all posts
	.get(function(req, res){
		Post.find(function(err, posts){
			if(err){
				return res.send(500, err);
			}
			return res.send(posts);
		});
	});

//post-specific commands. likely won't be used
router.route('/posts/:id')
	//gets specified post
	.get(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);
			res.json(post);
		});
	}) 
	//updates specified post
	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);

			post.created_by = req.body.created_by;
			post.text = req.body.text;

			post.save(function(err, post){
				if(err)
					res.send(err);

				res.json(post);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		Post.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});


router.use('/profil', isAuthenticated);

router.route('/profil')
	
	//Create empty profil when register new user
	.post(function(req, res){
		console.log('user id : '+ req.user._id);
		Profil.findOne({'userId': req.user._id}, function(err, profil){
			if(err){
				return res.send(500, err);
			}
			if (profil) {
				return res.send(profil);
			}
			else {
				var newProfil = new Profil();
				newProfil.userId = req.user._id;
				newProfil.userName = req.user.username;

				newProfil.save(function(err) {
					if (err){
						console.log('Error in Saving profil: '+err);  
						throw err;  
					}
					console.log(newProfil.userId + ' Registration succesful');    
					return res.send(newProfil);
				});
			}
		});
	});


router.route('/profil/:id')	
	
	.get(function(req, res) {
	    
	    Profil.findOne({'userName': req.params.id }, function(err, items) {
		    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
		    console.log('showing profil user : '+req.params.id);
		    if (err) {
		        res.send(err);
		    } else {
		    	console.log(items);
		        res.send(items);
		    };
	    });
		
	})

	.put(function(req, res) {

		if (req.isAuthenticated()){
			var id = req.params.id;
		    console.log(JSON.stringify(req.body));
		    console.log('Updating profil: ' + id);

		    var profilItem = req.body;
		    delete profilItem._id;

		    Profil.update({'userName': id}, profilItem, function(err) {
		    	if (err) {
		    		console.log('Error updating profil: ' + err);
		    		res.send({'error':'An error has occurred'});
		        } else {
		            console.log(profilItem.firstname + ' document(s) updated');
		            res.send(profilItem);
		        }
		    });
		    /*
		    Profil.findById(req.body._id, function(err, profilItem) {
		        if (err) {
		            console.log('Error updating profil: ' + err);
		            res.send({'error':'An error has occurred'});
		        } else {
		        	profilItem.firstname = req.body.firstname;
		        	profilItem.lastname = req.body.lastname;
		        	profilItem.job.title = req.body.job.title;

		        	Profil.update({_id: req.body._id}, profilItem, function(err, profilItem){
					if(err)
						res.send(err);

						res.json(profilItem);
					});
		        }

		    });
			*/
		} else {
			res.send(302);
		}
	});

module.exports = router;
