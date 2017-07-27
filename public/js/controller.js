app.controller('LoginController', function($scope, $location){

	$scope.admin = {
		userName : "",
		password : ""
	};
	
	$scope.loginAdmin = function(){
		if(($scope.admin.userName != null && $scope.admin.userName != "") && ($scope.admin.password != null && $scope.admin.password != "") && ($scope.admin.userName == "admin" && $scope.admin.password == "admin12#")){
			$location.path("home");
		}else{
			alert("Unauthorised access to the ePark Admin Panel not allowed.");
		}
	};
});


app.controller('AdminController', function($scope, $http){
	$scope.result = [];
	$scope.parkingSlot = [];
	$scope.totalSensorCount = 0;
	$scope.healthySensorCount = 0;
	$scope.faultySensorCount = 0;
	
	$http({
		  method: 'GET',
		  url: 'https://arupepark.herokuapp.com/location',
		  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).then(function successCallback(response){
			 $scope.parkingSlotCount = response.data.length;
			 $scope.totalSensorCount = response.data[0].number_of_slot;
			 for(var i=0;i<response.data.length;i++){
				 if((i+1) < response.data.length){
					 $scope.totalSensorCount = $scope.totalSensorCount + response.data[i+1].number_of_slot;	 
				 }else{
					 $scope.totalSensorCount = $scope.totalSensorCount;
				 }
				 $scope.result.push(response.data[i]);
				 for(var j=0; j<response.data[i].parking_arr.length; j++){
					 $scope.parkingSlot.push(response.data[i].parking_arr[j]);
					 if(response.data[i].parking_arr[j].status == 'available'){
						 $scope.imageSource = 'img/green.png';
						 $scope.healthySensorCount = $scope.healthySensorCount + 1;
					 }else{
						 $scope.imageSource = 'img/red.png';
						 $scope.faultySensorCount = $scope.faultySensorCount + 1;
					 }
				 }
			 }
		 }, function errorCallback(response){
			 alert(JSON.stringify(response));
		});
	
	
	$scope.deleteSensor = function(id){
		alert("ID : " +id);
		/*$http({
			  method: 'DELETE',
			  url: 'http://localhost:8080/eParkAdminNew/list.html' + id
			}).then(function successCallback(response){
				 alert(JSON.stringify(response));
			 }, function errorCallback(response){
				 alert(JSON.stringify(response));
		   });*/
	};
	
});