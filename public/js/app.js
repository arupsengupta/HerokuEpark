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
    .when('/contacts', {
		templateUrl : 'templates/contacts.html'
	});
});