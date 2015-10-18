var app = angular.module('chirpApp', ['ngRoute', 'ngResource','cloudinary', 'ngFileUpload']).run(function($http, $rootScope) {
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

app.controller('profilEditController', ['$http','$scope', '$rootScope', '$routeParams', '$location', 'Upload',

  function($http, $scope, $rootScope, $routeParams, $location, $upload){
  
  
  $scope.isSubmitting = false;
  $scope.showprofilPic = false;
  $scope.showbg = false;
  $scope.showcompanyLogo = false;
  //$scope.profil = Profil.query();

  console.log('routeParams id : ' + $routeParams.id);

  
  $scope.GetProfil = $http.get('api/profil/' + $routeParams.id)
  	.success(function(data) {
  		console.log(data);
        $scope.profil = data;
        console.log("profilPic id : " + data.profilPic);
        if (data.profilPic != "") {
        	$scope.showprofilPic = true;
        };
        if (data.bg != "") {
        	$scope.showbg = true;
        };
        if (data.companyLogo != "") {
        	$scope.showcompanyLogo = true;
        };
    });

  $scope.saveProfil = function(profil){
    $scope.isSubmitting = true;

    console.log($scope.profil);

    $scope.profil.profilPic = $scope.profilPic;
    $scope.profil.bg = $scope.bg;
    $scope.profil.companyLogo = $scope.companyLogo;

    $http.put('/api/profil/' + $routeParams.id, $scope.profil).
        success(function(data) {
          $location.path('/' + $routeParams.id);
        }).
        error(function () {
            $location.path('/');
        });
  };
	
  	var d = new Date();
    $scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
    //$scope.$watch('files', function() {
    $scope.uploadFiles1 = function(files){
      //console.log("files 1 : " + files1);
      //console.log("files 2 : " + files2);
      console.log("files : " + files);
      $scope.files = files;
      if (!$scope.files) return;
      angular.forEach(files, function(file){
        if (file && !file.$error) {
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
            fields: {
              upload_preset: $.cloudinary.config().upload_preset,
              tags: 'myphotoalbum',
              context: 'photo=' + $scope.title
            },
            file: file
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
            console.log("uploading...");
          }).success(function (data, status, headers, config) {
            console.log("upload success !");
            /*$rootScope.photos = $rootScope.photos || [];
            data.context = {custom: {photo: $scope.title}};
            file.result = data;
            $rootScope.photos.push(data);*/
            console.log("success upload profilPic: " + data.public_id);
            $scope.profilPic = data.public_id;
            $scope.showprofilPic = false;
          }).error(function (data, status, headers, config) {
            file.result = data;
          });
        }
      });
    };
    

    $scope.uploadFiles2 = function(files){
      $scope.files = files;
      if (!$scope.files) return;
      angular.forEach(files, function(file){
        if (file && !file.$error) {
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
            fields: {
              upload_preset: $.cloudinary.config().upload_preset,
              tags: 'myphotoalbum',
              context: 'photo=' + $scope.title
            },
            file: file
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
            console.log("uploading...");
          }).success(function (data, status, headers, config) {
            console.log("success upload bg: " + data.public_id);
            $scope.bg = data.public_id;
            $scope.showbg = false;
          }).error(function (data, status, headers, config) {
            file.result = data;
          });
        }
      });
		console.log($scope.bg);
    };

    $scope.uploadFiles3 = function(files){
      console.log("files : " + files);
      $scope.files = files;
      if (!$scope.files) return;
      angular.forEach(files, function(file){
        if (file && !file.$error) {
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
            fields: {
              upload_preset: $.cloudinary.config().upload_preset,
              tags: 'myphotoalbum',
              context: 'photo=' + $scope.title
            },
            file: file
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
            console.log("uploading...");
          }).success(function (data, status, headers, config) {
            console.log("upload success !");
            /*$rootScope.photos = $rootScope.photos || [];
            data.context = {custom: {photo: $scope.title}};
            file.result = data;
            $rootScope.photos.push(data);*/
            console.log("success upload companyLogo: " + data.public_id);
            $scope.companyLogo = data.public_id;
            $scope.showcompanyLogo = false;
          }).error(function (data, status, headers, config) {
            file.result = data;
          });
        }
      });
    };

}]);


	  
	  

/*--------------------------------------------------------------------------------------*/
/*-------------------------------- UPLOAD PICTURE --------------------------------------*/
/*--------------------------------------------------------------------------------------*/



app.factory('album', ['$rootScope', '$resource',
  function($rootScope, $resource){
    // instead of maintaining the list of images, we rely on the 'myphotoalbum' tag
    // and simply retrieve a list of all images with that tag.
    var url = $.cloudinary.url('myphotoalbum', {format: 'json', type: 'list'});
    //cache bust
    url = url + "?" + Math.ceil(new Date().getTime()/1000);
    return $resource(url, {}, {
      photos: {method:'GET', isArray:false}
    });
  }]);


app.controller('photoUploadCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Upload',

	/* Uploading with Angular File Upload */
	function($scope, $rootScope, $routeParams, $location, $upload) {
	    
	    //$.cloudinary.config().cloud_name = 'dnsvmolxa';
		//$.cloudinary.config().upload_preset = 'ba848rqk';

	    var d = new Date();
	    $scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
	    //$scope.$watch('files', function() {
	    $scope.uploadFiles = function(files){
	      $scope.files = files;
	      if (!$scope.files) return;
	      angular.forEach(files, function(file){
	        if (file && !file.$error) {
	          file.upload = $upload.upload({
	            url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
	            fields: {
	              upload_preset: $.cloudinary.config().upload_preset,
	              tags: 'myphotoalbum',
	              context: 'photo=' + $scope.title
	            },
	            file: file
	          }).progress(function (e) {
	            file.progress = Math.round((e.loaded * 100.0) / e.total);
	            file.status = "Uploading... " + file.progress + "%";
	          }).success(function (data, status, headers, config) {
	            $rootScope.photos = $rootScope.photos || [];
	            data.context = {custom: {photo: $scope.title}};
	            file.result = data;
	            $rootScope.photos.push(data);
	          }).error(function (data, status, headers, config) {
	            file.result = data;
	          });
	        }
	      });
	    };
	    //});

	    /* Modify the look and fill of the dropzone when files are being dragged over it */
	    $scope.dragOverClass = function($event) {
	      var items = $event.dataTransfer.items;
	      var hasFile = false;
	      if (items != null) {
	        for (var i = 0 ; i < items.length; i++) {
	          if (items[i].kind == 'file') {
	            hasFile = true;
	            break;
	          }
	        }
	      } else {
	        hasFile = true;
	      }
	      return hasFile ? "dragover" : "dragover-err";
	    };
	}]);




app.controller('homeController', function($scope, $rootScope, postService){
});