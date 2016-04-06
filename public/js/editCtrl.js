// ---- Module Setup ---- //
(function(){
  angular.module('webSynth')
  .controller('EditController', editCtrl)

  editCtrl.$inject = ['authService', 'userService', '$stateParams']


// ---- Controller Constructor ---- //
  function editCtrl(authService, userService, $stateParams){
    var vm = this

    // - store current user - //
    vm.user = authService.currentUser()

    // - lookup and store user from params id - //
    userService.getPatch(vm.user.id, $stateParams.id)
      .then(function(result){
        vm.patch = result.data.patch
      })

    // - log current patch object to console - //
    vm.logPatch = function(){
      console.log(vm.patch)
    }

    // - save the patch - //
    vm.savePatch = function(){
      userService.updatePatch(vm.user._id,vm.patch._id,vm.patch)
        .then(function(result){
          console.log(result);
        })
    }
  }

})()
