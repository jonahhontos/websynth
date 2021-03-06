(function(){
  angular.module('webSynth')
    .service('userService', userService)

  userService.$inject = ['$http']

  function userService($http){
    var self = this

    self.register = function(username,password){
      return $http.post('/users',{
        name: username,
        password: password
      })
    }

    // - pass given username and password to api - //
    self.login = function(username,password){
      return $http.post('/users/login',{
        name: username,
        password: password
      })
    }

    // - get public patches data - //
    self.getPublicPatches = function(){
      return $http.get('/users/public')
    }

    // - get data for a user - //
    self.getUser = function(id){
      return $http.get('/users/'+id)
    }

    // - get data for a patch - //
    self.getPatch = function(u_id,p_id){
      return $http.get('/users/'+u_id+'/patches/'+p_id)
    }

    // - create a patch - //
    self.createPatch = function(id,name){
      return $http.post('/users/'+id+'/patches', { name: name })
    }

    // - copy a patch - //
    self.copyPatch = function(id,patch){
      return $http.post('/users/'+id+'/patches/copy', { patch: patch })
    }

    // - save a patch - //
    self.updatePatch = function(u_id,p_id,patch){
      return $http.patch('/users/'+u_id+'/patches/'+p_id, patch)
    }

    // - delete a patch - //
    self.deletePatch = function(u_id,p_id){
      return $http.delete('/users/'+u_id+'/patches/'+p_id)
    }
  }
})()
