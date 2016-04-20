// ---- Module Setup ---- //
(function(){
  angular.module('webSynth')
  .controller('ProfileController', profileCtrl)

  profileCtrl.$inject = ['authService', 'userService', '$stateParams', '$state']


// ---- Controller Constructor ---- //
  function profileCtrl(authService, userService, $stateParams, $state){
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

    // - go back to home profile - //
    vm.backToProfile = function(){
      $state.go('profile', {id: user.id})
    }

    // - navigate to public patches - //
    vm.publicPatches = function(){
      userService.getPublicPatches()
        .then(function(result){
          console.log(result);
          $state.go('profile', {id: result.data.user._id})
        })
    }

    // - copy other user's patch to collection - //
    vm.copyToProfile = function(patch){
      userService.copyPatch(user.id,patch).then(function(result){
        $state.go('profile',{id:user.id})
      })
    }

    // - toggle creating a new patch - //
    vm.newPatch = function(){
      vm.creating = true
      vm.newPatchName = ""
    }

    // - create patch in db with provided name - //
    vm.createPatch = function(){
      userService.createPatch(user.id,vm.newPatchName).then(function(result){
        vm.patches.push(result.data.patch)
      })
      vm.creating = false
    }

    // - delete a patch - //
    vm.deletePatch = function(patch){
      userService.deletePatch(user.id, patch._id).then(function(result){
        vm.patches.splice(vm.patches.indexOf(),1)
      })
    }
  }
})()
