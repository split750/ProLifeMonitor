app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/signup', {
			templateUrl: 'signup.html',
			controller: 'authController'
		})
		.when('/godefroy.lemerdy', {
			templateUrl: 'profil.html'
		});
});