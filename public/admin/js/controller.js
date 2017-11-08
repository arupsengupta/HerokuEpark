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
	$scope.startingTime = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

	$scope.closingTime = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

	$scope.newLocation = {
		name : '',
		address : '',
		latitude : 0,
		longitude : 0,
		rate : 0,
		numberOfSlots : {
			two: 0,
			four: 0
		},
		startingTime : 0,
		closingTime : 0
	};

	$scope.resultSet = [];

	$http({
		  method: 'GET',
			//url: 'http://localhost:8080/location',
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
				//url: 'http://localhost:8080/location/' + locationID
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
				//url: 'http://localhost:8080/location',
			  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			  data: $.param({
							  "name": $scope.newLocation.name,
							  "lat": $scope.newLocation.latitude,
							  "lng": $scope.newLocation.longitude,
							  "address": $scope.newLocation.address,
							  "hourly_price": $scope.newLocation.rate,
							  "parking_slot_two": $scope.newLocation.numberOfSlots.two,
								"parking_slot_four": $scope.newLocation.numberOfSlots.four,
							  "booked_slot": 0,
							  "opening_hours_start": $scope.newLocation.startingTime,
							  "opening_hours_end": $scope.newLocation.closingTime
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
			$scope.result = response.data;
			$scope.parkingSlotCount = response.data.length;
			for(var i=0;i<$scope.result.length;i++){
				$scope.totalSensorCount += $scope.result[i].parking_arr.length;
				for(var j=0;j<$scope.result[i].parking_arr.length;j++){
					$scope.healthySensorCount += $scope.result[i].parking_arr[j].status == 'available' ? 1 : 0;
				}
			}
			$scope.faultySensorCount = $scope.totalSensorCount - $scope.healthySensorCount;
			$scope.green = 'img/green.png';
			$scope.red = 'img/red.png';
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

app.controller('LocationAdminController', function($scope, $http, $window){
	$scope.locationlist = [];
	$scope.adminList = [];
	$scope.adminLocMap = [];
	$scope.admin = {
		location: {
			name: ''
		},
		vendor: {
			tenure: 1,
			start_date : new Date()
		}
	};
	$scope.admin.vendor.end_date = new Date($scope.admin.vendor.start_date.getFullYear() + 1, $scope.admin.vendor.start_date.getMonth(), $scope.admin.vendor.start_date.getDate());

	$http.get('https://arupepark.herokuapp.com/location').then(function(success){
		$scope.locationlist = success.data;
	});

	$http.get('https://arupepark.herokuapp.com/locationAdmin').then(function(success){
		$scope.adminList = success.data;
	});

	$http.get('https://arupepark.herokuapp.com/locationAdmin/map/list').then(function(success){
		$scope.adminLocMap = success.data;
	});

	$scope.$watch('admin', function(newValue, oldValue, scope){
		scope.admin.vendor.end_date = new Date(newValue.vendor.start_date.getFullYear() + newValue.vendor.tenure, newValue.vendor.start_date.getMonth(), newValue.vendor.start_date.getDate());
	}, true);

	$scope.addLoationAdmin = function(){
		$http({
			method:'POST',
			url: 'https://arupepark.herokuapp.com/locationAdmin',
			headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
			data: $.param({
				"location_id" : $scope.admin.location.id,
				"name" : $scope.admin.name,
				"email" : $scope.admin.email,
				"mobile" : $scope.admin.mobile,
				"vendor_name" : $scope.admin.vendor.name,
				"vendor_add" : $scope.admin.vendor.address,
				"vendor_reg" : $scope.admin.vendor.reg,
				"vendor_tenure" : $scope.admin.vendor.tenure,
				"start_date" : $scope.admin.vendor.start_date,
				"end_date" : $scope.admin.vendor.end_date
			})
		}).then(function success(data){
			alert("Location successfully created");
			$window.location.reload();
		}, function error(){
			alert("Error in adding location admin");
		});
	};

	$scope.removeAdmin = function(index){
		$http({
			method: 'PUT',
			url: 'https://arupepark.herokuapp.com/locationAdmin/' +  $scope.adminList[index]._id
		}).then(function(success){
			alert("Admin removed successfully");
			$window.location.reload();
		}, function(err){
			alert("Error in removing admin");
		});
	};


});
