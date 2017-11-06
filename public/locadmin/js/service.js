
var app = angular.module('eParkLocAdmin');
app.factory('LoadingService', function($mdDialog){
  var alert;

  var isShown = false;

  var load = function(){
    if(!isShown){
      alert = {
        templateUrl: 'templates/modal/loader.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        fullscreen: false,
        controller: function DialogController($scope, $mdDialog){
          $scope.closeDialog = function(){
            $mdDialog.hide();
          }
        }
      };

      isShown = true;
      $mdDialog.show(alert);
      console.log('shown');
      //$mdDialog.cancel();
    }
  };

  var unload = function(){
    if(isShown){
      alert = undefined;
      console.log('hidden');
      $mdDialog.hide();
      //alert = undefined;
      isShown = false;
    }
  };

  var getIsShown = function(){
    return isShown;
  };

  return {
    load: load,
    unload: unload,
    getIsShown: getIsShown
  };
});
