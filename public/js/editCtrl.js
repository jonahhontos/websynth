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
        startVcos()
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
    var keyboard = new QwertyHancock({
                 id: 'keyboard',
                 width: 350,
                 height: 75,
                 octaves: 2,
                 startNote: 'A3',
                 whiteNotesColour: 'white',
                 blackNotesColour: 'black',
                 activeColour: '#069'
            })

    // - initialize oscillators - //
    var vcos = [new VCO(ctx),new VCO(ctx),new VCO(ctx)]
    function startVcos(){
      for (var i = 0; i<vcos.length; i++){
        vcos[i].start()
      }
    }

    // - sync playback vco settings to patch settings - //
    vm.syncVcos = function(){
      for (var i = 0; i<vcos.length; i++){
        vcos[i].setType(vm.patch.vcos[i].oType)
        vcos[i].setDetune(vm.patch.vcos[i].detune)
        vcos[i].setGain(vm.patch.vcos[i].gain)
      }
    }

    // - initialize amplifier - //
    var vca = new VCA(ctx)
    vca.setGain(0,0)

    // - connect oscillators to amplifier - //
    for (var i = 0; i<vcos.length; i++){
      vcos[i].connect(vca.amp)
    }

    // - connect amplifier to destination - //
    vca.connect(ctx.destination)



  // -- set listeners for qwerty hancock -- //
    // - keydown event - //
    keyboard.keyDown = function(note,frequency){
      var gain = 0.1
      for (var i=0; i<vcos.length; i++){
        vcos[i].setFrequency(frequency,0)
      }
      vca.setGain(gain, vm.patch.ampAdsr.attack)
      // vca.setGain(gain * vm.patch.ampAdsr.sustain, vm.patch.ampAdsr.decay + vm.patch.ampAdsr.attack)
    }
    // - keyup event - //
    keyboard.keyUp = function(note,frequency){
      vca.setGain(0,vm.patch.ampAdsr.release)
    }
  }



// ---- Audio Contructors ---- //
// - oscillator constructor - //
function VCO(ctx){
  var self = this

  self.osc = ctx.createOscillator()

  self.amp = ctx.createGain()

  self.setType = function(type){
    if(type) {
        self.osc.type = type
    }
  }

  self.setFrequency = function(freq, time){
    self.osc.frequency.setTargetAtTime(freq, 0, time)
  }

  self.setDetune = function(amount){
    self.osc.detune.value = amount
  }

  self.setGain = function(gain){
    self.amp.gain.value = gain
  }

  self.start = function(pos){
    pos = pos ? pos : 0
    self.osc.start(pos)
  }

  self.stop = function(pos) {
    self.osc.stop(pos);
  }

  self.connect = function(i) {
    self.amp.connect(i);
  }

  self.cancel = function() {
    self.osc.frequency.cancelScheduledValues(0);
  }

  self.osc.connect(self.amp)

  return self
}

// - amp constructor - //
function VCA(ctx){
  var self = this

  self.amp = ctx.createGain()

  self.setGain = function(gain, time){
    self.amp.gain.setTargetAtTime(gain,0,time)
  }

  self.rampGain = function(gain,time){
    self.amp.gain.linearRampToValueAtTime(gain, time)
  }

  self.connect = function(i){
    self.amp.connect(i)
  }

  return self
}

})()
