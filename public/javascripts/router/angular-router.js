app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'authController'
		})
		.when('/:id', {
			templateUrl: 'views/profil/index.html',
			controller: 'profilController'
		})
		.when('/:id/edit', {
			templateUrl: 'views/profil/edit.html',
			controller: 'profilEditController'
		});
});