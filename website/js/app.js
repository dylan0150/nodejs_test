var app = angular.module('nodeApp', [
  'ui.router','ngCookies'
])

  .run(function($rootScope, $state, user) {
    $rootScope.$on('$stateChangeStart', function(evt, to, toparams, fromstate, fromparams, options) {
      if (to.name != "rts" && to.name != 'profile') {
        if (!user.auth()) {
          evt.preventDefault()
        }
      }
    })
  })

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
        controller: 'rtsCtrl'
      })
        .state('rts.universe', {
          url: '/universe/{universe_id}',
          templateUrl: 'templates/rts/universe.html',
          controller: 'universeCtrl',
          resolve: {
            getUniverse: function($stateParams,$state,universeServe) {
              return universeServe.get(+$stateParams.universe_id).then(function(response){
                return response
              })
            }
          }
        })
          .state('rts.universe.galaxy', {
            url: '/galaxy/{galaxy_id}',
            templateUrl: 'templates/rts/galaxy.html',
            controller: 'galaxyCtrl'
          })
          .state('rts.universe.star', {
            url: '/galaxy/{galaxy_id}/star/{star_id}',
            templateUrl: 'templates/rts/star.html',
            controller: 'starCtrl'
          })
          .state('rts.universe.planet', {
            url: '/galaxy/{galaxy_id}/star/{star_id}/planet/{planet_id}',
            templateUrl: 'templates/rts/planet.html',
            controller: 'planetCtrl'
          })
          .state('rts.universe.region', {
            url: '/galaxy/{galaxy_id}/star/{star_id}/planet/{planet_id}/region/{region_id}',
            templateUrl: 'templates/rts/region.html',
            controller: 'regionCtrl'
          })
      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/rts/profile.html',
        controller: 'profileCtrl'
      })

    $urlRouterProvider
      .otherwise('/main')
  })
