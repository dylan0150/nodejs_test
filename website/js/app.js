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

      .state('main', {
        url: '/main',
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl',
        resolve: {

        }
      })

    $urlRouterProvider
      .otherwise('/main')
  })
