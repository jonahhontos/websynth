// ---- Module Setup ---- //
(function(){
  angular.module('webSynth')
  .controller('EditController', editCtrl)

  editCtrl.$inject = ['authService', 'userService', '$stateParams', '$window']



// ---- Controller Constructor ---- //
  function editCtrl(authService, userService, $stateParams, $window){
    var vm = this



    // ---- Users and Patches ---- //
    // - store current user - //
    vm.user = authService.currentUser()

    // - lookup and store user from params id - //
    userService.getPatch(vm.user.id, $stateParams.id)
      .then(function(result){
        vm.patch = result.data.patch
        vm.syncVcos()
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



    // ---- Audio and MIDI ---- //
    // - create audio context - //
    var ctx = new $window.AudioContext()

    // - initialize qwerty hancock - //
    vm.keyboard = new QwertyHancock({
                 id: 'keyboard',
                 width: 350,
                 height: 75,
                 octaves: 2,
                 startNote: 'A3',
                 whiteNotesColour: 'white',
                 blackNotesColour: 'black',
                 hoverColour: '#f3e939'
            })

    // - initialize oscillators - //
    var vcos = [new VCO(ctx),new VCO(ctx),new VCO(ctx)]

    // - sync playback vco settings to patch settings - //
    vm.syncVcos = function(){
      for (var i = 0; i<vcos.length; i++){
        vcos[i].setType(vm.patch.vcos[i].oType)
      }
    }

    // - initialize amplifier - //
    var vca = new VCA(ctx)

    // - connect vcos to amplifier - //
    for (var i = 0; i<vcos.length; i++){
      vcos[i].connect(vca.amp)
    }

    // - connect amplifier to destination - //
    vca.connect(ctx.destination)
  }



// ---- Audio Contructors ---- //
// - oscillator constructor - //
function VCO(ctx){
  var self = this

  self.osc = ctx.createOscillator()

  self.setType = function(type){
    if(type) {
        self.osc.type = type
    }
  }

  self.setFrequency = function(freq, time){
    self.osc.frequency.setTargetAtTime(freq, 0, time)
  }

  self.start = function(pos){
    self.osc.start(pos)
  }

  self.stop = function(pos) {
    self.osc.stop(pos);
  }

  self.connect = function(i) {
    self.osc.connect(i);
  }

  self.cancel = function() {
    self.osc.frequency.cancelScheduledValues(0);
  }

  return self
}

// - amp constructor - //
function VCA(ctx){
  var self = this

  self.amp = ctx.createGain()

  self.setGain = function(gain, time){
    self.amp.gain.setTargetAtTime(gain,0,time)
  }

  self.connect = function(i){
    self.amp.connect(i)
  }

  return self
}

})()
