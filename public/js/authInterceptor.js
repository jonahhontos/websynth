(function(){
  angular.module('webSynth')
    .factory('authInterceptor', authInterceptor)

  authInterceptor.$inject = ['authService']

  function authInterceptor(authService){
    return {
      // - attach token to request header - //
      request: function(config) {
        var token = authService.getToken()
        if(token) {
          config.headers['x-access-token'] = token
        }
        return config;
      },

      // - save the token if it is attached to response data - //
      response: function(res){
          if (res.data.token) authService.saveToken(res.data.token)
          return res
        }
      }
    }
  })()
