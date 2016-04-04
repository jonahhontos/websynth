(function(){
  angular.module('webSynth')
    .config(['$stateProvider','$urlRouterProvider', mainRouter])

  function mainRouter($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/')

  $stateProvider
  .state('login',{
       url: '/',
       templateUrl: '/partials/login.html',
       controller: 'LoginController as lc'
    })
    .state('edit',{
       url: '/edit/:id',
       templateUrl: '/partials/people.html',
       controller: 'EditController as ec'
    })
  }
})()
