var app = angular.module('nodeApp', [
  'ui.router'
])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('ball', {
        url: '/ball',
        templateUrl: 'templates/ball.html',
        controller: 'ballCtrl',
        resolve: {

        }
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl',
        resolve: {

        }
      })

    $urlRouterProvider
      .otherwise('/ball')
  })
