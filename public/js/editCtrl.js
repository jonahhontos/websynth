// ---- Module Setup ---- //
(function(){
  angular
    .module('webSynth')
    .controller('EditController', editCtrl)

  editCtrl.$inject = ['authService', 'userService', '$stateParams', '$window', '$state', '$scope', 'Devices']



// ---- Controller Constructor ---- //
  function editCtrl(authService, userService, $stateParams, $window, $state, $scope, devices){
    var vm = this

    var keysdown = 0


    // ---- Users and Patches ---- //
    // - store current user - //
    vm.user = authService.currentUser()

    // - lookup and store user from params id - //
    userService.getPatch(vm.user.id, $stateParams.id)
      .then(function(result){
        vm.patch = result.data.patch
        vm.syncVcos()
        vm.syncFilter()
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

    // - save and go back - //
    vm.goBack = function(){
      vm.savePatch()
      $state.go("profile",{id: vm.user.id})
    }



    // ---- Audio and MIDI ---- //
    // - create audio context - //
    var ctx = new $window.AudioContext()

    // - initialize qwerty hancock - //
    var keyboard
    function syncKeyboard(){
      keyboard = new QwertyHancock({
                   id: 'keyboard',
                   width: 300,
                   height: 75,
                   octaves: 2,
                   startNote: 'A3',
                   whiteNotesColour: 'white',
                   blackNotesColour: 'black',
                   activeColour: '#069'
              })
    }
    syncKeyboard()

    // - set up MIDI connections - //
    vm.devices = []
    devices
      .connect()
      .then(function(access) {
          if('function' === typeof access.inputs) {
              // deprecated
              vm.devices = access.inputs()
              console.error('Update your Chrome version!')
          } else {
              if(access.inputs && access.inputs.size > 0) {
                  var inputs = access.inputs.values(),
                      input = null

                  // iterate through the devices
                  for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                      vm.devices.push(input.value)
                  }
              } else {
                  console.error('No devices detected!')
              }
          }
          console.log(vm.devices)
      })
      .catch(function(e) {
          console.error(e)
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
        // syncKeyboard()
      }
    }

    // - sync keyboard to filter settings - //
    vm.syncAdsr = function(){
      // syncKeyboard()
    }

    // - initialize amplifier - //
    var vca = new VCA(ctx)
    vca.setGain(0,0)

    // - initialize filter - //
    var filter = new Filter(ctx)

    // - connect oscillators to filter - //
    for (var i = 0; i<vcos.length; i++){
      vcos[i].connect(filter.filter)
    }

    // - sync filter playback settings to patch - //
    vm.syncFilter = function(){
      filter.setType(vm.patch.filter.fType)
      filter.setCutoff(vm.patch.filter.cutoff)
      filter.setResonance(vm.patch.filter.resonance)
      // syncKeyboard()
    }

    // - connect filter to amp - //
    filter.connect(vca.amp)

    // - connect amplifier to destination - //
    vca.connect(ctx.destination)



  // -- set listeners for qwerty hancock -- //
    // - keydown event - //
    keyboard.keyDown = function(note,frequency){
      var gain = 0.8
      for (var i=0; i<vcos.length; i++){
        vcos[i].setFrequency(frequency,0)
      }
      vca.setGain(gain, vm.patch.ampAdsr.attack)
      keysdown++
      // filter.rampCutoff(vm.patch.filter.frequency * 1.3, vm.patch.filterAdsr.attack)
      // vca.setGain(gain * vm.patch.ampAdsr.sustain, vm.patch.ampAdsr.decay + vm.patch.ampAdsr.attack)
    }
    // - keyup event - //
    keyboard.keyUp = function(note,frequency){
      keysdown--
      if (keysdown<=1){
        vca.setGain(0,vm.patch.ampAdsr.release)
      }
      // filter.rampCutoff(vm.patch.filter.frequency, vm.patch.filterAdsr.release)
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

// - filter constructor - //
function Filter(ctx){
  var self = this

  self.filter = ctx.createBiquadFilter()

  self.setType = function(type){
    self.filter.type = type
  }

  self.setCutoff = function(cutoff){
    self.filter.frequency.value = cutoff
  }

  self.rampCutoff = function(cutoff, time){
    time = time ? time : 0
    self.filter.frequency.setTargetAtTime(cutoff,0,time)
  }

  self.setResonance = function(resonance){
    self.filter.Q.value = resonance
  }

  self.connect = function(i){
    self.filter.connect(i)
  }

  return self
}

})()
