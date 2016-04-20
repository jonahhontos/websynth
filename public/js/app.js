(function(){
  angular
    .module('WebMIDI', [])
    .factory('Devices', ['$window', function($window) {
        function _connect() {
            if($window.navigator && 'function' === typeof $window.navigator.requestMIDIAccess) {
                return $window.navigator.requestMIDIAccess();
            } else {
                throw 'No Web MIDI support';
            }
        }

        return {
            connect: _connect
        }
    }])

  angular.module('webSynth', ['ui.router','ngMaterial', 'WebMIDI'])
    .config(function($httpProvider){
      $httpProvider.interceptors.push('authInterceptor')
    })
    .config(function($mdThemingProvider){
      $mdThemingProvider.theme('default')
        .dark()
        .primaryPalette('blue-grey')
        .accentPalette('cyan')
    })
})()
