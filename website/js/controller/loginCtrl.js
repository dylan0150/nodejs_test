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
      label:'Email',
      name:'email',
      placeholder:'example@something.com',
      type:'email',
      minlength:3,
      maxlength:'',
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
    }
  ]

  $scope.form_state = 'login'

  var keyfound = false
  $scope.changeState = function(state) {
    $scope.form_state = state
    if (!keyfound) {
      var keys = document.getElementsByClassName('field-key')
      if (keys.length > 0) keyfound = true;
      for (var k = 0; k < keys.length; k++) {
        keys[k].addEventListener('input', function(e){
          var val = e.target.value.replace(/ - /g,'')
          var len = Math.min(val.length,16)
          var str = ''
          for (var i = 0; i < len; i++) {
            str += val.charAt(i)
            if ( (i+1) % 4 == 0 && i < 15 && len > i+1 ) { str += ' - '; }
          }
          e.target.value = str
        })
      }
    }
  }

  $scope.checkPassValid = function(name) {
    if (name == 'password' && $scope.reg.password == $scope.reg.password) {
      return 'has-danger'
    }
    if (name == 'password_2') {
      return 'has-danger'
    }
  }

  $scope.login = function() {
    var username = $scope.login_form[0].value
    var password = $scope.login_form[1].value
    user.login(username,password)
  }

  $scope.register = function() {
    var username = $scope.register_form[0].value
    var email =  $scope.register_form[1].value
    var password = $scope.register_form[2].value
    user.create(username,password,email)
  }
})
