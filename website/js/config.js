app.constant('config', {
  'host':'http://localhost:8080/'
})

app.config(function($httpProvider){
  $httpProvider.interceptors.push(function(){
    return {
      
    }
  })
})
