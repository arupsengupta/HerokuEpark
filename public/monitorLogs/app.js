var app = angular.module('monitoringApp', []);

app.controller('LoggingController', function($scope, $http){
	$scope.results = [];
	$scope.results1 = [];
	$scope.results2 = [];
	
	$http({
		method : 'GET',
		url : 'http://www.eparkindia.com/booking'
	}).then(function successCallBack(response){
		for(var i=0; i < response.data.length ; i++){
			if(response.data[i].operator_id == '5a228a34c21aef0014009923'){
				if(response.data[i].date == '02-12-2017' || response.data[i].date == '03-12-2017'){
					//DO NOTHING
				}else{
					$scope.results.push(response.data[i]);	
				}
			}else if(response.data[i].operator_id == '5a22890bc21aef0014009922'){
				if(response.data[i].date == '02-12-2017' || response.data[i].date == '03-12-2017'){
					//DO NOTHING
				}else{
					$scope.results1.push(response.data[i]);
				}
			}else if(response.data[i].operator_id == '5a26148285751400145d23bf'){
				if(response.data[i].date == '02-12-2017' || response.data[i].date == '03-12-2017'){
					//DO NOTHING
				}else{
					$scope.results2.push(response.data[i]);
				}
			}
		}
	}, function errorCallBack(response){
		alert(JSON.stringify(response));
	});
});