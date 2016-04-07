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

    vm.login = function(){
      userService.login(vm.username,vm.password)
        .then(handleRequest,handleRequest)

    }

    if (user){
      $state.go('profile', {id: user.id})
    }
  }
})()
