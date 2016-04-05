(function(){
  angular.module('webSynth')
    .service('authService', authService)

  authService.$inject = ['$window']

  function authService($window){
    var self = this

    // - parse jwt to json - //
    self.parseJwt = function(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    };

    // - put the token into localStorage - //
    self.saveToken = function(token){
      $window.localStorage['jwtToken'] = token
    }

    // - retrieve token from localStorage - //
    self.getToken = function() {
      return $window.localStorage['jwtToken'];
    }

    // - check if user is authorized - //
    self.isAuthed = function() {
      var token = self.getToken()
      if(token) {
        var params = self.parseJwt(token)
        return Math.round(new Date().getTime() / 1000) <= params.exp
      } else {
        return false
      }
    }

    // - return current user - //
    self.currentUser = function() {
      var token = self.getToken();
      if(token) {
        var params = self.parseJwt(token)
        return {name: params._doc.name, id: params._doc._id}
      } else {

        return false
      }
    }

    // - delete token to logout - //
    self.logout = function() {
      $window.localStorage.removeItem('jwtToken')
    };
  }
})()
