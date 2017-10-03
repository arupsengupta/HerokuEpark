var app = angular.module('eParkLocAdmin',['ngMaterial','ui.router','ngMessages']);

app.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider){
  $stateProvider.state('home',{
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'MainCtrl'
  })
  .state('home.operators', {
    url: '/operator',
    templateUrl: 'templates/operators.html',
    controller: 'OperatorController'
  })
  .state('home.corporate', {
    url: '/corporate',
    templateUrl: 'templates/corporate.html',
    controller: 'CorporateController'
  })
  .state('home.corporate-view', {
    url: '/corporate/:id',
    templateUrl: 'templates/corporate-view.html',
    controller: 'CorporateViewController'
  });

  $urlRouterProvider.otherwise('/home');


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
