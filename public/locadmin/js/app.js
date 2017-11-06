var app = angular.module('eParkLocAdmin',['ngMaterial','ui.router','ngMessages']);

app.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, $httpProvider, $provide){
  $stateProvider.state('home',{
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'MainCtrl'
  })
  .state('home.home',{
    url: '/main',
    templateUrl: 'templates/main.html',
    controller: 'HomeController'
  })
  .state('home.profile',{
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'ProfileController'
  })
  .state('home.operators', {
    url: '/operator',
    templateUrl: 'templates/operators.html',
    controller: 'OperatorController'
  })
  .state('home.bookings', {
    url: '/bookings',
    templateUrl: 'templates/booking.html',
    controller: 'BookingController'
  })
  .state('home.corporate', {
    url: '/corporate',
    templateUrl: 'templates/corporate.html',
    controller: 'CorporateController'
  })
  .state('home.corporate-view', {
    templateUrl: 'templates/corporate-view.html',
    url: '/corporate/:id',
    controller: 'CorporateViewController'
  });

  $urlRouterProvider.otherwise('/home/main');

  // $httpProvider.interceptors.push('loadingInterceptor');

  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});

app.run(function($rootScope){
  $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl){
    if($rootScope.$$childHead.showContextMenu !== undefined){
      if($rootScope.$$childHead.showContextMenu){
        $rootScope.$$childHead.itemSelectedCount = 0;
        event.preventDefault();
      }
    }
  });
});

app.factory('loadingInterceptor', ['$injector',function($injector){
  return{
    'request': function(config){

      var service = $injector.get('LoadingService');
      if(!service.getIsShown()){
        console.log('request');
        service.load();
      }

      //service.unload();
      return config;
    },

    'response': function(response){

      var service = $injector.get('LoadingService');
      if(service.getIsShown()){
          console.log('response');
          service.unload();
      }
      return response;
    }
  };
}]);
