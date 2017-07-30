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


app.controller('UserController', function($scope, $http, $window){
	$scope.userArray = [];
	
	$http({
		  method: 'GET',
		  url: 'https://arupepark.herokuapp.com/users',
		  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).then(function successCallback(response){
			for(var i=0;i<response.data.length;i++){
				$scope.userArray.push(response.data[i]);
			}
		}, function errorCallback(response){
			 alert(JSON.stringify(response));
		});	
	
	$scope.deleteUser = function(userID){
		$http({
			  method: 'DELETE',
			  url: 'https://arupepark.herokuapp.com/users/' + userID
		}).then(function successCallback(response){
			alert("User account deleted succcessfully");
			$window.location.reload();
		}, function errorCallback(response){
			alert("Error in deleting this user."); 
		});	
	};
});


app.controller('AddLocationController', function($scope, $http, $window){
	$scope.startingTime = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
	
	$scope.closingTime = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
	
	$scope.newLocation = {
		name : '',
		address : '',
		latitude : 0,
		longitude : 0,
		rate : 0,
		numberOfSlots : 0,
		startingTime : 0,
		closingTime : 0
	};
	
	$scope.resultSet = [];
	
	$http({
		  method: 'GET',
		  url: 'https://arupepark.herokuapp.com/location',
		  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).then(function successCallback(response){
			for(var i=0;i<response.data.length;i++){  
			    $scope.resultSet.push(response.data[i]);
			}
		}, function errorCallback(response){
			 alert(JSON.stringify(response));
	});
	
	
	$scope.deleteLocation = function(locationID){
		$http({
			  method: 'DELETE',
			  url: 'https://arupepark.herokuapp.com/location/' + locationID
		}).then(function successCallback(response){
			alert("Location successfully deleted");
			$window.location.reload();
		}, function errorCallback(response){
			alert("Error in deleting this Location."); 
		});	
	};
	
	$scope.createLocation = function(){
		$http({
			  method: 'POST',
			  url: 'https://arupepark.herokuapp.com/location',
			  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			  data: $.param({
							  "name": $scope.newLocation.name,
							  "lat": $scope.newLocation.latitude,
							  "lng": $scope.newLocation.longitude,
							  "address": $scope.newLocation.address,
							  "hourly_price": $scope.newLocation.rate,
							  "number_of_slot": $scope.newLocation.numberOfSlots,
							  "booked_slot": 0,
							  "opening_hours":{
							      "start": $scope.newLocation.startingTime,
							      "end": $scope.newLocation.closingTime
							  }
				       })
			}).then(function successCallback(response){
				alert("Location successfully created");
				$window.location.reload();
			}, function errorCallback(response){
				alert("Oops! This Location could not be created"); 
			});	
	};
	
});


app.controller('AdminController', function($scope, $http){
	$scope.result = [];
	$scope.parkingSlot = [];
	$scope.totalSensorCount = 0;
	$scope.healthySensorCount = 0;
	$scope.faultySensorCount = 0;
	
	var d = new Date();
	$scope.currentDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
	$scope.hours = d.getHours();
	if($scope.hours > 12){
		$scope.currentHour = $scope.hours - 12;
		$scope.meridian = "PM";
	}else if($scope.hours == 12){
		$scope.currentHour = 12;
		$scope.meridian = "PM";
	}else{
		$scope.currentHour = $scope.hours;
		$scope.meridian = "AM";
	}
	
	$scope.currentTime = $scope.currentHour + ":" + d.getMinutes() + " " + $scope.meridian ; 
	
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
				 $scope.openingHoursTest = response.data[i].opening_hours.start;
				 $scope.closingHoursTest = response.data[i].opening_hours.end;
				 $scope.openingHours = $scope.checkTimeFormatNew($scope.openingHoursTest);
				 $scope.closingHours = $scope.checkTimeFormatNew($scope.closingHoursTest);
				 
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
	
	
	$scope.getSlotDetails = function(locationID, slotID){
		$scope.bookingPresentFlag = false;
		
		$scope.slotIDDisplay = slotID;
		$scope.bookingStartTime = 0;
		$scope.bookingSpan = 0;
		$scope.startTime = 0;
		$scope.bookingStatus = "";
		$scope.userOTP = 0;
		$scope.userOTPStatus =""; 
		$scope.bookingSpan = 0;
		
		$scope.bookedUserName = "";
	    $scope.bookedVehicleNumber = "";
	    $scope.bookedUserEmail = "";
	    $scope.bookedUserMob = ""; 
		
		$http({
			  method: 'GET',
			  url: 'https://arupepark.herokuapp.com/booking',
			  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			}).then(function successCallback(response1){
				for(var i=0;i<response1.data.length;i++){
					if(response1.data[i].parking_id == locationID && response1.data[i].slot_id == slotID){
						$scope.slotIDDisplay = slotID;
						$scope.getUserDetails(response1.data[i].user_id);
						$scope.startTime = response1.data[i].start_time;
						$scope.bookingSpan = response1.data[i].hours;
						
						if($scope.startTime > 0 && $scope.bookingSpan > 0){
							$scope.bookingPresentFlag = true;
						}else{
							$scope.bookingPresentFlag = false;
						}
						
						$scope.bookingStatus = response1.data[i].status;
						$scope.userOTP = response1.data[i].otp.value;
						$scope.otpStatus = response1.data[i].otp.matched;
						
						if($scope.otpStatus == false){
							$scope.userOTPStatus = "No, awaiting car's arrival";
						}else{
							$scope.userOTPStatus = "Yes, done";
						}
						
						$scope.checkTimeFormat($scope.startTime);
						break;
					}
				}
			}, function errorCallback(response1){
				 alert(JSON.stringify(response1));
			});
	};
	
	
	$scope.checkTimeFormat = function(testTime){
		if(testTime > 12){
			$scope.bookingStartTime = (testTime - 12) + ":" + "00 PM";
		}
		else if(testTime == 12){
			$scope.bookingStartTime = "12:00 PM";
		}else{
			$scope.bookingStartTime = testTime + ":" + "00 AM";
		}
	};
	
	$scope.checkTimeFormatNew = function(testTime){
		if(testTime > 12){
			return (testTime - 12) + ":" + "00 PM";
		}
		else if(testTime == 12){
			return "12:00 PM";
		}else{
			return testTime + ":" + "00 AM";
		}
	};
	
	$scope.getUserDetails = function(userID){
		$scope.bookedUserName = "";
	    $scope.bookedVehicleNumber = "";
	    $scope.bookedUserEmail = "";
	    $scope.bookedUserMob = ""; 
		$http({
			  method: 'GET',
			  url: 'https://arupepark.herokuapp.com/users',
			  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			}).then(function successCallback(response2){
				for(var i=0;i<response2.data.length;i++){
					if(response2.data[i]._id == userID){
					    $scope.bookedUserName = response2.data[i].name;
					    $scope.bookedVehicleNumber = response2.data[i].vehicle_no;
					    $scope.bookedUserEmail = response2.data[i].email;
					    $scope.bookedUserMob = response2.data[i].phone;
					    break;
					}
				}
			}, function errorCallback(response2){
				 alert(JSON.stringify(response2));
			});
	};
	
});