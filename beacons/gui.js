var UserInterface = function() {
  this.scale = DEFAULT_SCALE;
  this.scale_history = DEFAULT_SCALE;
  this.min_note = MIN_NOTE;
  this.max_note = MAX_NOTE;
  this.movement = "-1 1";
  this.modulate = function() {
    modulate();
  };
  this.reset_camera = function() {
    CAMERA.position.set(...DEFAULT_CAMERA_POS);
  };
  this.exposure = 1;
	this.bloomStrength = 1.5;
	this.bloomThreshold = 0;
	this.bloomRadius = 0;
};

function initGui() {
  // Register callbacks
  let controller;
  controller = GUI.add(INPUT, 'scale').onFinishChange(setScale);
  controller = GUI.add(INPUT, 'scale_history', SCALE_HISTORY).onFinishChange(setScale);
  controller = GUI.add(INPUT, 'min_note', 0, MIDI_MAX).listen().onChange(onMinNoteChange).step(1);
  controller = GUI.add(INPUT, 'max_note', 0, MIDI_MAX).listen().onChange(onMaxNoteChange).step(1);
  controller = GUI.add(INPUT, 'movement').onFinishChange(setMovement);
  controller = GUI.add(INPUT, 'modulate');

  let f2 = GUI.addFolder('Graphics');
  controller = f2.add(INPUT, 'reset_camera');
  controller = f2.add(INPUT, 'exposure', 0.1, 2).onChange(onExposureChange);
  controller = f2.add(INPUT, 'bloomThreshold', 0.0, 1.0).onChange(onBloomThresholdChange);
	controller = f2.add(INPUT, 'bloomStrength', 0.0, 3.0 ).onChange(onBloomStrengthChange);
  controller = f2.add(INPUT, 'bloomRadius', 0.0, 1.0 ).step(0.01).onChange(onBloomRadiusChange);
}
