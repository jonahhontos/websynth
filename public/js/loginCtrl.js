// ---- Module Setup ---- //
(function(){
  angular.module('webSynth')
    .controller('LoginController', loginCtrl)

  loginCtrl.$inject = ['userService','authService','$state']


// ---- Controller Constructor ---- //
  function loginCtrl(userService, authService, $state){
    var vm = this

    var user = authService.currentUser()

    function handleRequest(res){
      var token = res.data ? res.data.token : null
      user = authService.currentUser()
      if (user){
        $state.go('profile', {id: user.id})
      }
    }

    // - log a user in - //
    vm.login = function(){
      userService.login(vm.username,vm.password)
        .then(handleRequest,handleRequest)
    }

    // - register a user - //
    vm.register = function(){
      userService.register(vm.username, vm.password).then(function(){
        
      })
    }

    // - redirect to profile if logged in - //
    if (user){
      $state.go('profile', {id: user.id})
    }
  }
})()
