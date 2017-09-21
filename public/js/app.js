var app = angular.module('eParkWeb', ['ngMaterial', 'directive.g+signin', 'ngMessages']);

app.controller('HomeController', function($scope, $mdMenu){
	var originatorEv;

    $scope.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };
});

app.controller('HistoryController', function($scope){
	
});


app.controller('BookingController', function($scope, $mdDialog){
	$scope.mapPath = 'images/map.png';
	$scope.imagePath = 'images/ePark.png';
	$scope.customFullscreen = false;
	
	$scope.rate = 30;
	$scope.availabilityStatus = "Slots Available";
	
	this.myDate = new Date();
	this.isOpen = false;
	
	$scope.data = {
		 group1 : 'Two-Wheeler',
		 group2 : 'Four-Wheeler',
    };
	
	function DialogController($scope, $mdDialog) {
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };
	  }
	
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'templates/dialog1.tmpl.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: $scope.customFullscreen 
	    });
	};
});

app.controller('ProfileController', function($scope){
	$scope.user = {
		name : '',
		firstName : '',
		imageUrl : '',
		email : '',
		mobile : '',
		vehicleReg : '',
		vehicleType : ''
	};
	
	$scope.user.mobile = "9874332133";
	$scope.user.vehicleReg = "WB 08D 1145";
	$scope.text = "";
	
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		width : 100,
		height : 100
	});

	$scope.$on('event:google-plus-signin-success', function (event, authResult) {
    	$scope.user.name = authResult.w3.ig;
    	$scope.user.firstName = authResult.w3.ofa;
    	$scope.user.email = authResult.w3.U3; 
    	
    	if(authResult.w3.Paa != null || authResult.w3.Paa != ""){
    		$scope.user.imageUrl = authResult.w3.Paa;
    	}else{
    		$scope.user.imageUrl = "images/user.png";
    	}
    	
    	qrcode.makeCode(authResult.w3.ig);
        $scope.$apply();
    });

    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
      console.log('Not signed into Google Plus.');
    });
});