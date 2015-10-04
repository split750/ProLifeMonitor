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
	res.redirect('/#/');
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
	
	//gets profil info
	/*.get(function(req, res){
		Profil.findOne({'user_id': req.user._id}, function(err, profil){
			if(err){
				return res.send(500, err);
			}
			//console.log(req.user);
			return res.send(profil);
		});
	})*/

	.get(function(req, res){
		console.log('user id : '+ req.user._id);
		Profil.findOne({'userId': req.user._id}, function(err, profils){
			if(err){
				return res.send(500, err);
			}
			return res.send(profils);
		});
	});


router.route('/profil/:id')	
	
	.get('/profil/:id', function(req, res) {
	    var profilId = req.params.id;
	    console.log('Retrievong profil : ' + profilId);
	    Profil.findOne({'userId': profilId }, function foundUsers(err, items) {
	      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
	      if (err) {
	        res.send(err);
	      } else {
	        res.send(items);
	      };
	    });
	  })

	.put(function(req, res) {
		var id = req.params.id;
		console.log('id is : ' + id);
	    
	    var profilItem = req.body;
    
	    delete profilItem._id;
	    
	    console.log('Updating profil: ' + id);
	    console.log('line 42 : ' + JSON.stringify(profilItem));

	    Profil.update({'_id': id}, profilItem, function(err) {
	        if (err) {
	            console.log('Error updating profil: ' + err);
	            res.send({'error':'An error has occurred'});
	        } else {
	            console.log(userItem.title + ' profil document(s) updated');
	            res.send(profilItem);
	        }
	    });

	    /*var profilItem = profil;
	    
	   	console.log('profil items : ' + JSON.stringify(profilItem));

	    Profil.findOne({'userId': req.user._id}, function(err, profil){
	        if (err) {
	            console.log('Error updating profil: ' + err);
	            res.send({'error':'An error has occurred'});
	        }

	        console.log('profil items : ' + JSON.stringify(profil));
	        
	        profil.firstname = profilItem.firstname;

	        profil.update(function(err, profil){
				if(err)
					res.send(err);

				res.json(profil);
			});
	    });*/

	});

module.exports = router;
