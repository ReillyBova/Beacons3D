// Beacon class
function Beacon() {
    this.type = 'Beacon';
    this.geometry = new THREE.SphereBufferGeometry( 6, 32, 24 );
    this.material = new THREE.MeshBasicMaterial( { color: 0x005555 } );

    THREE.Mesh.call( this, this.geometry, this.material );
    SCENE.add(this);

}

Beacon.prototype = Object.create( THREE.Mesh.prototype );
Beacon.prototype.constructor = Beacon;
Beacon.prototype.getMesh = function() {
    return this.mesh;
}
Beacon.prototype.start = function() {
  this.lastUpdate = Date.now();
  this.state = -1;
  this.visible = false;
  this.updateLoop();
}
Beacon.prototype.updateLoop = function() {
  setTimeout(this.updateLoop.bind(this), FREQUENCY);

  if (this.visible) {
    this.visible = false;
    return;
  }
  this.visible = true;
  this.state = (this.state + 1) % 3;
  this.playNote();
}

Beacon.prototype.playNote = function() {
  let val = -1;
  if (this.state == 0) {
    val = this.position.x;
  } else if (this.state == 1) {
    val = this.position.y;
  } else if (this.state == 2) {
    val = this.position.z;
  } else {
    return;
  }

  let pct = val / (MIDI_MAX + 1);
  let index = Math.floor(pct * NOTES.length);
  let note = NOTES[index];
  MIDI.noteOn(0, note, 50, 0);
  MIDI.noteOff(0, note, FREQUENCY*4);
}
