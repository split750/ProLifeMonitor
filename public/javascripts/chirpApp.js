var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($http, $rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = 'Guest';

	$rootScope.signout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = 'Guest';
	};
});



/*
//used for basic read from json
app.factory('postService', function($http){
	var baseUrl = "sample.json";
	var factory = {};
	factory.getAll = function(){
		return $http.get(baseUrl);
	};
	return factory;
});
*/
app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

app.controller('mainController', function($scope, $rootScope, postService){
	$scope.posts = postService.query();
	$scope.newPost = "";
/*
//used for basic read from json
	postService.getAll().success(function(data){
		$scope.posts = data;
	});
*/
	$scope.post = function() {
		postService.save({created_by: $rootScope.current_user, text: $scope.newPost, created_at: Date.now()}, 
		function(){
			$scope.posts = postService.query();
			$scope.newPost = "";	
		});
	};
	$scope.delete = function(post)	{
		postService.delete({id: post._id});
		$scope.posts = postService.query();
	};
});


app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};

	$scope.register = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				//$location.path('/');
				
				$http.post('/api/profil').success(function(data) {
			        $location.path('/');
			    });

			}
			else{
				$scope.error_message = data.message;
			}
		});

	};

	$scope.userinfo = function() {
        $http.get('/auth/currentuser').
            success(function (data) {
                $scope.loggeduser = data;
            }).
            error(function () {
                $location.path('/login');
            });
    };
});



app.factory('Profil', function($http){
    return {
    	get : function(id) {
    		return $http.get('api/profil/' + id);
    	}
    }
});


app.controller('profilController', function($http, $scope, $routeParams, $location, Profil){
	$scope.getProfil = Profil.get($routeParams.id)
	  	.success(function(data) {
	        console.log(data);
	        $scope.profil = data;
	    }).
        error(function () {
            $location.path('/');
        });
});

app.controller('profilEditController', function($http, $scope, $routeParams, $location, Profil){
  
  $scope.isSubmitting = false;
  //$scope.profil = Profil.query();
  console.log('routeParams id : ' + $routeParams.id);

  $scope.getProfil = Profil.get($routeParams.id)
  	.success(function(data) {
  		console.log(data);
        $scope.profil = data;
    });

  $scope.saveProfil = function(profil){
    $scope.isSubmitting = true;

    console.log($scope.profil);

    $http.put('/api/profil/' + $routeParams.id, $scope.profil).
      success(function(data) {
        $location.path('/profil/' + $routeParams.id);
      });
  };

});