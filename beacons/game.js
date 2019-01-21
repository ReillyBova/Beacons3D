// Setup all game
function initGame() {
  // Init Grid
  initGrid();
  // Initialize scale
  setScale(DEFAULT_SCALE);
  // Initialize selection
  initSelection();
}

function initGrid() {
  // Init Axes
  AXES = [];
  for (let i = 0; i < 3; i++) {
    let geometry = new THREE.BufferGeometry();
    // Grid attributes
    let positions = new Float32Array( MIDI_MAX * 3 ); // 3 vertices per point
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    let material = new THREE.PointsMaterial( {
                		size: 3,
                		sizeAttenuation: true,
                		map: new THREE.TextureLoader().load( 'textures/disc.png' ),
                		alphaTest: 0.25,
                    color: 0x888888,
                		morphTargets: true,
                	} );
    geometry.setDrawRange( 0, 0 );
    AXES.push(new THREE.Points( geometry, material ));
  }

  X_AXIS = AXES[0];
  Y_AXIS = AXES[1];
  Z_AXIS = AXES[2];

  SCENE.add( X_AXIS );
  SCENE.add( Y_AXIS );
  SCENE.add( Z_AXIS );

  // Init Planes
  let plane_geometry = new THREE.PlaneBufferGeometry( FAR, FAR );
  plane_geometry.rotateY( Math.PI / 2 );
  X_PLANE = new THREE.Mesh( plane_geometry, new THREE.MeshBasicMaterial( { visible: false, color: 0xff0000} ) );
  X_PLANE.name = "x_plane";
  X_PLANE.userData.pos = 0; // For translation bookkeeping

  plane_geometry = new THREE.PlaneBufferGeometry( FAR, FAR );
  plane_geometry.rotateX( - Math.PI / 2 );
  Y_PLANE = new THREE.Mesh( plane_geometry, new THREE.MeshBasicMaterial( { visible: false, color: 0x00ff00 } ) );
  Y_PLANE.name = "y_plane";
  Y_PLANE.userData.pos = 0; // For translation bookkeeping

  plane_geometry = new THREE.PlaneBufferGeometry( FAR, FAR );
  Z_PLANE = new THREE.Mesh( plane_geometry, new THREE.MeshBasicMaterial( { visible: false, color: 0x0000ff } ) );
  Z_PLANE.name = "z_plane";
  Z_PLANE.userData.pos = 0; // For translation bookkeeping

  SCENE.add( X_PLANE );
  SCENE.add( Y_PLANE );
  SCENE.add( Z_PLANE );
  PLANES = [X_PLANE, Y_PLANE, Z_PLANE];
}

function initSelection() {
  SELECTION = new THREE.Vector3();
  let geometry = new THREE.SphereBufferGeometry(2, 32, 24);
	let r_material = new THREE.MeshBasicMaterial({ color: 0xff0000});
  let g_material = new THREE.MeshBasicMaterial({ color: 0x00ff00});
  let b_material = new THREE.MeshBasicMaterial({ color: 0x0000ff});

  X_SELECT_NODE = new THREE.Mesh( geometry, r_material );
  Y_SELECT_NODE = new THREE.Mesh( geometry, g_material );
  Z_SELECT_NODE = new THREE.Mesh( geometry, b_material );

  X_SELECT_NODE.visible = false;
  Y_SELECT_NODE.visible = false;
  Z_SELECT_NODE.visible = false;

  SCENE.add(X_SELECT_NODE);
  SCENE.add(Y_SELECT_NODE);
  SCENE.add(Z_SELECT_NODE);

  // Line guides
  r_material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  g_material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  b_material = new THREE.LineBasicMaterial({ color: 0x0000ff });

  let x_geometry = new THREE.Geometry();
  let y_geometry = new THREE.Geometry();
  let z_geometry = new THREE.Geometry();

  x_geometry.vertices.push(new THREE.Vector3( -FAR, 0, 0 ), new THREE.Vector3( FAR, 0, 0 ));
	y_geometry.vertices.push(new THREE.Vector3( 0, -FAR, 0 ), new THREE.Vector3( 0, FAR, 0 ));
  z_geometry.vertices.push(new THREE.Vector3( 0, 0, -FAR ), new THREE.Vector3( 0, 0, FAR ));

  X_SELECT_GUIDE = new THREE.Line( x_geometry, r_material );
  Y_SELECT_GUIDE = new THREE.Line( y_geometry, g_material );
  Z_SELECT_GUIDE = new THREE.Line( z_geometry, b_material );

  //X_SELECT_GUIDE.visible = false;
  //Y_SELECT_GUIDE.visible = false;
  //Z_SELECT_GUIDE.visible = false;

  SCENE.add(X_SELECT_GUIDE);
  SCENE.add(Y_SELECT_GUIDE);
  SCENE.add(Z_SELECT_GUIDE);
}

/*function changeNote(direction) {
  let possibleChanges = []
  let temp = [pc for pc in SCALE]
  for i in temp:
    for j in direction:
      if (i + j) % 12 not in temp:
        possibleChanges.append([i, j])
  alteration = random.choice(possibleChanges)
  i = temp.index(alteration[0])
  self.parsimoniousScale[i] += alteration[1]
  self.display_scale(sorted([x % 12 for x in self.parsimoniousScale]))*/

function setScale(scale_string) {
  // Convert scale to list
  const temp_arr = scale_string.split(" ").map(Number);
  let scale_arr = [];
  for (let i = 0; i < temp_arr.length; i++) {
    // Filter out bad numbers
    if (isNaN(temp_arr[i])) {
      continue;
    }

    // Modulo to fit in octave space (and also work for negative numbers)
    scale_arr.push(pitch_to_pitchClass(temp_arr[i]));
  }

  // Update globals and add to history
  old_scale = SCALE;
  SCALE = scale_arr;
  SCALE_HISTORY.unshift(scale_string);

  // Update GUI history
  updateDropdown(GUI, SCALE_HISTORY, 1);
  INPUT.scale = scale_string;
  INPUT.scale_history = SCALE_HISTORY;

  // Enact the scale change into the game
  buildNotes();
}

function buildNotes() {
  // Generate new notes
  pitchClasses_in_scale = []
  for (let i = 0; i < SCALE_SIZE; i++) {
    pitchClasses_in_scale.push(false);
  }
  for (let i = 0; i < SCALE.length; i++) {
    pitchClasses_in_scale[SCALE[i]] = true;
  }
  // Iterate through all possible notes and append what we want to keep
  NOTES = [];
  for (let pitch = MIN_NOTE; pitch < MAX_NOTE; pitch++) {
    // Test for scale membership
    const pitchClass = pitch % SCALE_SIZE;
    if (pitchClasses_in_scale[pitchClass]) {
      NOTES.push(pitch);
    }
  }

  // Update Axes
  let ax = X_AXIS.geometry.attributes.position.array;
  let ay = Y_AXIS.geometry.attributes.position.array;
  let az = Z_AXIS.geometry.attributes.position.array;
  const noteCount = NOTES.length;
  const scale_factor = MIDI_MAX / noteCount;
  for (let i = 1; i < noteCount; i++) {
    const ival = i * 3;
    const pos = i * scale_factor
    ax[ival] = pos;
    ax[ival + 1] = 0;
    ax[ival + 2] = 0;

    ay[ival] = 0;
    ay[ival + 1] = pos;
    ay[ival + 2] = 0;

    az[ival] = 0;
    az[ival + 1] = 0;
    az[ival + 2] = pos;
  }

  // Mark for redrawing with new positions
  X_AXIS.geometry.setDrawRange( 0, noteCount );
  X_AXIS.geometry.computeBoundingSphere();
  X_AXIS.geometry.attributes.position.needsUpdate = true;
  Y_AXIS.geometry.setDrawRange( 0, noteCount );
  Y_AXIS.geometry.computeBoundingSphere();
  Y_AXIS.geometry.attributes.position.needsUpdate = true;
  Z_AXIS.geometry.setDrawRange( 0, noteCount );
  Z_AXIS.geometry.computeBoundingSphere();
  Z_AXIS.geometry.attributes.position.needsUpdate = true;
}

function beacons() {
  // Check if we need a ghost beacon
  if (SELECTED_COUNT >= 2 && CURRENT_BEACON === null) {
    CURRENT_BEACON = new Beacon();
  } else if (SELECTED_COUNT < 2 && CURRENT_BEACON !== null) {
    SCENE.remove(CURRENT_BEACON);
    CURRENT_BEACON = null;
  }

  if (CURRENT_BEACON !== null) {
    CURRENT_BEACON.position.copy(SELECTION);
  }

  // Update beacons
  //for (let i = 0; i < BEACONS.length; i++) {
//    BEACONS[i].updateState();
//  }
}
