var app = angular.module('monitoringApp', []);

app.controller('LoggingController', function($scope, $http){
	$scope.results = [];
	$scope.results1 = [];
	
	$http({
		method : 'GET',
		url : 'http://www.eparkindia.com/booking'
	}).then(function successCallBack(response){
		for(var i=0; i < response.data.length ; i++){
			if(response.data[i].operator_id == '5a228a34c21aef0014009923'){
				$scope.results.push(response.data[i]);
			}else if(response.data[i].operator_id == '5a22890bc21aef0014009922'){
				$scope.results1.push(response.data[i]);
			}
		}
	}, function errorCallBack(response){
		alert(JSON.stringify(response));
	});
});