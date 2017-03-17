var app = angular.module('nodeApp', [
  'ui.router','ngCookies'
])

  .run(function($rootScope, $state, $http, user, template) {
    $rootScope.$on('$stateChangeStart', function(evt, to, toparams, fromstate, fromparams, options) {
      user.cookieAuth().then(function(response){
        if (to.name == 'login' && response.ok) {$state.go('main')}
        else if (!response.ok) {$state.go('login')}
      })
    })
    template.cache()
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })

      .state('main', {
        url: '/main',
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl',
        resolve: {
          userdata: function(user) {
            return user.get()
          }
        }
      })
        .state('main.universe', {
          url: '/universe/{universe_id}',
          templateUrl: 'templates/universe.html',
          controller: 'universeCtrl'
        })


    $urlRouterProvider
      .otherwise('/login')
  })
