var app = angular.module('nodeApp', [])

app.controller('main',function($scope, $http){
  $scope.content = "Hello World"

  $scope.get = function() {
    $http.get(
      'http://localhost:8080/api/test?param1=blahblah&param2=HelloWorld'
    ).then(function(response){
      console.log(response)
    })
  }

  $scope.post = function() {
    $http.post(
      'http://localhost:8080/api/test',
      {
        obj: {
          key: 'value'
        },
        array: [1,2,3,'string'],
        thing: 'value'
      }
    ).then(function(response){
      console.log(response)
    })
  }
})
