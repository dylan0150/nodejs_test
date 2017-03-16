app.controller('loginCtrl', function($scope,$state,user){

  $scope.login_form = [
    {
      label:'Username',
      name:'username',
      placeholder:'Username',
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
      placeholder:'Password',
      type:'password',
      minlength:8,
      maxlength:32,
      min:'',
      max:'',
      required:true
    }
  ]

  $scope.register_form = [
    {
      label:'Username',
      name:'username',
      placeholder:'Username',
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
      placeholder:'New Password',
      type:'password_validate',
      minlength:8,
      maxlength:32,
      min:'',
      max:'',
      required:true
    },
    {
      label:'Key',
      name:'key',
      placeholder:'####-####-####-####',
      type:'text',
      minlength:19,
      maxlength:19,
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
    var username = $scope.login_form[0].value
    var password = $scope.login_form[1].value
    user.login(username,password).then(function(response){
      console.log(response)
    })
  }

  $scope.register = function() {
    var username = $scope.register_form[0].value
    var password = $scope.register_form[1].value
    var key =  $scope.register_form[2].value
    user.create(username,password,key).then(function(response){
      console.log(response)
    })
  }
})
