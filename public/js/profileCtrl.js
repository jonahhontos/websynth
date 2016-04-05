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
      })

    vm.newPatch = function(){
      // toggle new patch inputs
    }

    vm.createPatch = function(){
      // create a new patch in db and redirect to edit
    }
  }
})()
