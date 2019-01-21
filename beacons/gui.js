var UserInterface = function() {
  this.scale = DEFAULT_SCALE;
  this.scale_history = DEFAULT_SCALE;
  this.min_note = MIN_NOTE;
  this.max_note = MAX_NOTE;
};

function initGui() {
  // Register callbacks
  let controller;
  controller = GUI.add(INPUT, 'scale').onFinishChange(setScale);
  controller = GUI.add(INPUT, 'scale_history', SCALE_HISTORY).onFinishChange(setScale);
  controller = GUI.add(INPUT, 'min_note', 0, MIDI_MAX).listen().onChange(onMinNoteChange).step(1);
  controller = GUI.add(INPUT, 'max_note', 0, MIDI_MAX).listen().onChange(onMaxNoteChange).step(1);
}
