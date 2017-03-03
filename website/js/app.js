var app = angular.module('nodeApp', [
  'ui.router'
])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl',
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
      .otherwise('/home')
  })
