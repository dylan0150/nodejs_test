var app = angular.module('nodeApp', [
  'ui.router','ngCookies'
])

  .run(function($rootScope, $state, user) {
    $rootScope.$on('$stateChangeStart', function(evt, to, toparams, fromstate, fromparams, options) {
      if (to.name != "login") {
        if (!user.cookieAuth()) {
          evt.preventDefault()
          $state.go('login')
        }
      }
    })
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('main', {
        url: '/main',
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })

    $urlRouterProvider
      .otherwise('/login')
  })
