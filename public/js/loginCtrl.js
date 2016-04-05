(function(){
  angular.module('webSynth')
    .controller('LoginController', loginCtrl)

  loginCtrl.$inject = ['userService','authService']

  function loginCtrl(userService, authService){
    var vm = this

    function handleRequest(res){
      var token = res.data ? res.data.token : null
      console.log(res)
    }

    vm.logUser = function(){
      console.log(authService.currentUser())
    }

    vm.login = function(){
      userService.login(vm.username,vm.password)
        .then(handleRequest,handleRequest)
    }
  }
})()
