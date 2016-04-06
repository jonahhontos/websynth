(function(){
  angular.module('webSynth', ['ui.router','ngMaterial'])
    .config(function($httpProvider){
      $httpProvider.interceptors.push('authInterceptor')
    })
    .config(function($mdThemingProvider){
      $mdThemingProvider.theme('default')
      .dark()
    })
})()
