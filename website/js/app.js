var app = angular.module('nodeApp', [
  'ui.router','ngCookies'
])

  .run(function($rootScope, $state, user) {
    $rootScope.$on('$stateChangeStart', function(evt, to, toparams, fromstate, fromparams, options) {
      if (user.cookieAuth()) {
        if (to.name == "login") {
          evt.preventDefault()
          $state.go('main')
        }
      } else {
        if (to.name != "login") {
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
      .state('gotologin', {
        url: '/gotologin',
        controller: function($state) {
          $state.go('login')
          //prevents infinite digest loop when login
        }
      })

    $urlRouterProvider
      .otherwise('/gotologin')
  })
