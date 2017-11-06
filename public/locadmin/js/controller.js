var app = angular.module('eParkLocAdmin');

app.controller('MainCtrl',function($scope, $mdSidenav, $state, $rootScope){
  $rootScope.parking_id = '59cf5fff2e9aee114c11884d';
  $scope.user = {
    id: '59cfdd90a458633568ed5931'
  };
  
  $scope.header = 'RS Software';
  $scope.showContextMenu = false;
  $scope.itemSelectedCount = 0;

  $scope.sideToogle = function(){
    $mdSidenav('left').toggle();
  };

  $scope.navigate = function(path){
    $scope.sideToogle();
    $state.go(path);
  };

  $scope.toogleContextMenu = function(){
    $scope.itemSelectedCount = 0;
  };

  $scope.deleteSelectedItem = function(){
    if($state.current.name === "home.operators"){
      $scope.$$childTail.deleteOperator();
    }
  };

  $scope.editSelectedItem = function(){
    if($state.current.name === "home.operators"){
      $scope.$$childTail.editOperator();
    }
  };
});

app.controller('HomeController', function($scope){
  $scope.$parent.header = 'Home';
});

app.controller('OperatorController', function($scope, $mdDialog, $http, $rootScope){

  $scope.operator = {};
  $scope.operatorList = [];
  $scope.$parent.itemSelectedCount = 0;
  $scope.$parent.header = 'Operators';
  $scope.getOperatorList = function(){
    $http({
      method: 'GET',
      url: 'https://arupepark.herokuapp.com/operator'
    }).then(function(success){
      $scope.operatorList = success.data;
    });
  };

  $scope.addOperator = function(){
    $mdDialog.show({
      scope: $scope,
      preserveScope: true,
      controller: 'AddOperatorController',
      templateUrl: 'templates/modal/addOperator.html',
      parent: angular.element(document.body),
      fullscreen: true
    });
  };

  $scope.editOperator = function(){

    for(var i=0;i<$scope.operatorList.length;i++){
      if($scope.operatorList[i].selected){
        $scope.operator = $scope.operatorList[i];
        break;
      }
    }

    $mdDialog.show({
      scope: $scope,
      preserveScope: true,
      controller: 'EditOperatorController',
      templateUrl: 'templates/modal/addOperator.html',
      parent: angular.element(document.body),
      fullscreen: true
    });
  };

  $scope.deleteOperator = function(){
    var idArr = [];
    for(var i=0;i<$scope.operatorList.length; i++){
      if($scope.operatorList[i].selected){
        idArr.push($scope.operatorList[i]._id);
      }
    }
    $http({
      method: 'PUT',
      url: 'https://arupepark.herokuapp.com/operator',
      headers: {'Content-Type':'application/json'},
      data: {
        id: idArr
      }
    }).then(function(success){
      if(success.status === 200){
        $scope.getOperatorList();
        $scope.$parent.itemSelectedCount = 0;
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Confirmation')
            .textContent('Operator removed succcessfully')
            .ok('OK')
        );
      }
    },function(err){
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Error')
          .textContent('Cannot remove opeartor')
          .ok('Ok')
      );
    })
  };

  $scope.itemOnLongPress = function(index) {
    $scope.operatorList[index].selected = !$scope.operatorList[index].selected;
    if($scope.operatorList[index].selected){
      $scope.$parent.itemSelectedCount++;
    }else{
      $scope.$parent.itemSelectedCount--;
    }
  };

  $scope.itemOnTouchEnd = function(index) {
    if($scope.$parent.itemSelectedCount > 0){
      $scope.operatorList[index].selected = !$scope.operatorList[index].selected;
      if($scope.operatorList[index].selected){
        $scope.$parent.itemSelectedCount++;
      }else{
        $scope.$parent.itemSelectedCount--;
      }
    }
  };

  $scope.getOperatorList();

  $scope.$watch('$parent.itemSelectedCount', function(newValue, oldValue, scope){
    if(newValue > 0){
      scope.$parent.showContextMenu = true;
    }else{
      scope.$parent.showContextMenu = false;
      for(var i=0;i<scope.operatorList.length; i++){
        scope.operatorList[i].selected = false;
      }
    }
  });
});

app.controller('AddOperatorController', function($scope, $mdDialog, $http, $rootScope){
  $scope.closeModal = function(){
    $mdDialog.hide();
  };

  $scope.operator.parking_id = $rootScope.parking_id;

  $scope.addOperatorModal = function(){
    $http({
      method: 'POST',
      url: 'https://arupepark.herokuapp.com/operator',
      headers: {'Content-Type' : 'application/json'},
      data: $scope.operator
    }).then(function(success){
      if(success.status === 200){
        $scope.operatorList.push(success.data);
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Confirmation')
            .textContent('Operator added succcessfully')
            .ok('OK')
        );
      }else{
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Error')
            .textContent('Cannot add opeartor')
            .ok('Ok')
        );
      }
    }, function(err){
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Error')
          .textContent('Cannot add opeartor')
          .ok('Ok')
      );
    });
  };
});

app.controller('EditOperatorController', function($scope, $mdDialog, $http, $rootScope){
  $scope.closeModal = function(){
    $mdDialog.hide();
  };

  $scope.addOperatorModal = function(){
    $http({
      method: 'PUT',
      url: 'https://arupepark.herokuapp.com/operator/' + $scope.operator._id,
      headers: {'Content-Type' : 'application/json'},
      data: $scope.operator
    }).then(function(success){
      if(success.status === 200){
        $scope.$parent.itemSelectedCount = 0;
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Confirmation')
            .textContent('Operator updated succcessfully')
            .ok('OK')
        );
      }else{
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Error')
            .textContent('Cannot update opeartor')
            .ok('Ok')
        );
      }
    }, function(err){
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Error')
          .textContent('Cannot update opeartor')
          .ok('Ok')
      );
    });
  };
});

app.controller('CorporateController', function($scope, $mdDialog, $http){
  $scope.$parent.header = 'Corporate Customers';
  $scope.corporateList = [];

  $scope.addCorporate = function(){
    $mdDialog.show({
      scope: $scope,
      preserveScope: true,
      controller: 'AddCorporateController',
      templateUrl: 'templates/modal/addCorporate.html',
      parent: angular.element(document.body),
      fullscreen: true
    });
  };

  $scope.getCorporateList = function(){
    $http({
      method: 'GET',
      url: 'https://arupepark.herokuapp.com/corporate'
    }).then(function(success){
      $scope.corporateList = success.data;
    },function(err){
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Error')
          .textContent('Cannot get corporate list')
          .ok('Ok')
      );
    });
  };

  $scope.getCorporateList();
});

app.controller('AddCorporateController', function($scope, $mdDialog, $http, $rootScope){
  $scope.closeModal = function(){
    $mdDialog.hide();
  };

  $scope.operator = {
    parking_id : $rootScope.parking_id
  };

  $scope.addCorporateModal = function(){
    $http({
      method: 'POST',
      url: 'https://arupepark.herokuapp.com/corporate',
      headers: {'Content-Type' : 'application/json'},
      data: $scope.corporate
    }).then(function(success){
      if(success.status === 200){
        $scope.corporateList.push(success.data);
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Confirmation')
            .textContent('Company details added succcessfully')
            .ok('OK')
        );
      }else{
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Error')
            .textContent('Cannot add Company details')
            .ok('Ok')
        );
      }
    }, function(err){
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Error')
          .textContent('Cannot add company details')
          .ok('Ok')
      );
    });
  };
});

app.controller('CorporateViewController', function($scope, $stateParams, $http){
  var id = $stateParams.id;
  $http({
    method: 'GET',
    url: 'https://arupepark.herokuapp.com/corporate/' + id
  }).then(function(success){
    $scope.company = success.data;
  },function(err){
  });
});

app.controller('ProfileController', function($scope){
  $scope.$parent.header = 'Profile';
});

app.controller('BookingController', function($scope, $mdDialog){
  $scope.$parent.header = 'Bookings';
  $scope.booking = {
    range: 'Date',
    date: new Date()
  };

  $scope.addBooking = function(){
    if($scope.tab.selectedIndex === 1){
      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        controller: 'AddBookingController',
        templateUrl: 'templates/modal/addMonthlyBooking.html',
        parent: angular.element(document.body),
        fullscreen: true
      });
    }else if($scope.tab.selectedIndex === 2){
      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        controller: 'AddCorporateBookingController',
        templateUrl: 'templates/modal/addCorporateBooking.html',
        parent: angular.element(document.body),
        fullscreen: true
      });
    }
  }
});

app.controller('AddBookingController', function($scope, $mdDialog){
  $scope.closeModal = function(){
    $mdDialog.hide();
  };
});

app.controller('AddCorporateBookingController', function($scope, $mdDialog, $timeout, $http){
  $scope.closeModal = function(){
    $mdDialog.hide();
  };

  $scope.loadCompany = function(){
    return $timeout(function(){
      $http({
        method: 'GET',
        url: 'https://arupepark.herokuapp.com/corporate'
      }).then(function(success){
        $scope.corporateList = success.data;
      },function(err){
      });
    }, 650);
  };
});
