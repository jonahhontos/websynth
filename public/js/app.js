(function(){
  angular.module('webSynth', ['ui.router'])
    .config(function($httpProvider){
      $httpProvider.interceptors.push('authInterceptor')
    })
})()
