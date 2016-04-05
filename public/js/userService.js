(function(){
  angular.module('webSynth')
    .service('userService', userService)

  userService.$inject = ['$http']

  function userService($http){
    var self = this

    // - pass given username and password to api - //
    self.login = function(username,password){
      return $http.post('/users/login',{
        name: username,
        password: password
      })
    }
  }
})()
