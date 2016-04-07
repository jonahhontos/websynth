// ---- Module Setup ---- //
(function(){
  angular.module('webSynth')
  .controller('ProfileController', profileCtrl)

  profileCtrl.$inject = ['authService', 'userService', '$stateParams']


// ---- Controller Constructor ---- //
  function profileCtrl(authService, userService, $stateParams){
    var vm = this

    // - store current user - //
    var user = authService.currentUser()

    // - lookup and store user from params id - //
    userService.getUser($stateParams.id)
      .then(function(result){
        vm.user = result.data.user
        // - store whether current user matches profile user - //
        vm.isUser = (vm.user._id == user.id)
        vm.patches = vm.user.patches
      })

    // - log out user - //
    vm.logout = function(){
      authService.logout()
    }

    vm.newPatch = function(){
      vm.creating = true
      vm.newPatchName = ""
    }

    vm.createPatch = function(){
      userService.createPatch(user.id,vm.newPatchName).then(function(result){
        vm.patches.push(result.data.patch)
      })
      vm.creating = false
    }
  }
})()
