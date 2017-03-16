app.controller('loginCtrl', function($scope,$state,user){
  $scope.log = {}
  $scope.reg = {}

  $scope.login_form = [
    {
      label:'Username',
      name:'username',
      placeholder:'',
      type:'text',
      minlength:6,
      maxlength:32,
      min:'',
      max:'',
      required:true
    },
    {
      label:'Password',
      name:'password',
      placeholder:'',
      type:'password',
      minlength:8,
      maxlength:32,
      min:'',
      max:'',
      required:true
    }
  ]

  $scope.form_state = 'login'

  $scope.changeState = function(state) {
    $scope.form_state = state
  }

  $scope.checkPassValid = function(name) {
    if (name == 'password'
    && $scope.reg.password == $scope.reg.password
    ) {
      return 'has-danger'
    }
    if (name == 'password_2') {
      return 'has-danger'
    }
  }

  $scope.login = function() {
    console.log($scope.logForm)
  }

  $scope.register = function() {
    console.log($scope)
  }
})
