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

      .state('bird', {
        url: '/bird',
        templateUrl: 'templates/bird.html',
        controller: 'birdCtrl',
        resolve: {

        }
      })

      .state('rts', {
        url: '/rts',
        templateUrl: 'templates/rts.html',
        controller: 'rtsCtrl',
        resolve: {

        }
      })

    $urlRouterProvider
      .otherwise('/main')
  })
