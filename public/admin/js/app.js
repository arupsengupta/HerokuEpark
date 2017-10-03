var app = angular.module('adminApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('');                        //TO CHANGE THE !# to # in ANGULAR ROUTING
    $routeProvider
	.when('/', {
		templateUrl : 'templates/login.html',
		controller : 'LoginController'
	})
	.when('/home', {
		templateUrl : 'templates/home.html',
		controller : 'AdminController'
	})
	.when('/user', {
		templateUrl : 'templates/userDetails.html',
		controller : 'UserController'
	})
  .when('/addLocation', {
		templateUrl : 'templates/addLocation.html',
		controller : 'AddLocationController'
	})
	.when('/addLocationAdmin', {
		templateUrl : 'templates/locationadmin.html',
		controller : 'LocationAdminController'
	});
});
