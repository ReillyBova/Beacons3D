function onWindowResize() {
	CAMERA.aspect = window.innerWidth / window.innerHeight;
	CAMERA.updateProjectionMatrix();
	RENDERER.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	MOUSE.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	MOUSE.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentMouseDown( event ) {
	event.preventDefault();

	// Left click
	if (event.button == THREE.MOUSE.LEFT) {
			// Make selection from intersection with planes
			RAYCASTER.setFromCamera( MOUSE, CAMERA );
			let intersects = RAYCASTER.intersectObjects( PLANES );
			selectionClick(intersects);
	}
}

function onDocumentKeyDown( event ) {
	// Prevent capture of the GUI
	if (document.activeElement != document.body) {
		return;
	}

	let key = event.key;
	if (key == " ") {
		// Reset selection
		selectionReset();
	} else if (key == "x") {
		if (SELECTED[0]) {
			SELECTED[0] = false;
			SELECTED_COUNT -= 1;
			shiftPlane(X_PLANE, 0, 0);
		} else {
			SELECTED[0] = true;
			SELECTED_COUNT += 1;
			shiftPlane(X_PLANE, SELECTION.x, 0);
		}
	} else if (key == "y") {
		if (SELECTED[1]) {
			SELECTED[1] = false;
			SELECTED_COUNT -= 1;
			shiftPlane(Y_PLANE, 0, 0);
		} else {
			SELECTED[1] = true;
			SELECTED_COUNT += 1;
			shiftPlane(Y_PLANE, SELECTION.y, 1);
		}
	} else if (key == "z") {
		if (SELECTED[2]) {
			SELECTED[2] = false;
			SELECTED_COUNT -= 1;
			shiftPlane(Z_PLANE, 0, 0);
		} else {
			SELECTED[2] = true;
			SELECTED_COUNT += 1;
			shiftPlane(Z_PLANE, SELECTION.z, 2);
		}
	} else if (key == "Enter") {
		if (CURRENT_BEACON === null) {
			return;
		}
		BEACONS.push(CURRENT_BEACON);
		CURRENT_BEACON.start();
		CURRENT_BEACON = null;
		selectionReset();
	} else if (key == "k") {
		if (BEACONS.length == 0) {
			return;
		}
		// Kill the first beacon
		popped_beacon = BEACONS.shift();
		popped_beacon.kill();
	} else if (key == "K") {
		// Kill all
		while (BEACONS.length > 0) {
			popped_beacon = BEACONS.shift();
			popped_beacon.kill();
		}
	} else {
		// We did nothing, so let the browser handle the keypress
		return;
	}

	// Prevent the browser from also handling the keypress
	event.preventDefault();
}

function onMinNoteChange(minNote) {
	// Clamp
	if (minNote > INPUT.max_note) {
		INPUT.min_note = Math.max(0, INPUT.max_note);
	}
	// Build grid if necessary
	if (MIN_NOTE != INPUT.min_note) {
		MIN_NOTE = INPUT.min_note;
		buildNotes();
	}
}

function onMaxNoteChange(maxNote) {
	// Clamp
	if (maxNote < INPUT.min_note) {
		INPUT.max_note = Math.min(INPUT.min_note, MIDI_MAX);
	}
	// Build grid if necessary
	if (MAX_NOTE != INPUT.max_note) {
		MAX_NOTE = INPUT.max_note;
		buildNotes();
	}
}

function onExposureChange(value) {
	RENDERER.toneMappingExposure = Math.pow(value, 4.0);
}

function onBloomThresholdChange(value) {
	BLOOMPASS.threshold = Number(value);
}

function onBloomStrengthChange(value) {
	BLOOMPASS.strength = Number(value);
}

function onBloomRadiusChange(value) {
	BLOOMPASS.radius = Number(value);
}

function selectionHover(intersects) {
  if (intersects && intersects.length > 0) {
    if (!SELECTED[0]) {
      SELECTION.x =  Math.min(intersects[0].point.x, MIDI_MAX);
      X_SELECT_NODE.position.set(SELECTION.x, 0, 0);
      if (SELECTION.x > 1e-3) {
        X_SELECT_NODE.visible = true;
      } else if (SELECTED_COUNT == 0) {
        X_SELECT_NODE.visible = false;
      }
    }

    if (!SELECTED[1]) {
      SELECTION.y =  Math.min(intersects[0].point.y, MIDI_MAX);
      Y_SELECT_NODE.position.set(0, SELECTION.y, 0);
      if (SELECTION.y > 1e-3) {
        Y_SELECT_NODE.visible = true;
      } else if (SELECTED_COUNT == 0) {
        Y_SELECT_NODE.visible = false;
      }
    }

    if (!SELECTED[2]) {
      SELECTION.z = Math.min(intersects[0].point.z, MIDI_MAX);
      Z_SELECT_NODE.position.set(0, 0, SELECTION.z);
      if (SELECTION.z > 1e-3) {
        Z_SELECT_NODE.visible = true;
      } else if (SELECTED_COUNT == 0) {
        Z_SELECT_NODE.visible = false;
      }
    }

		// Handle guides
		if (SELECTED_COUNT > 0) {
			X_SELECT_GUIDE.visible = true;
	    Y_SELECT_GUIDE.visible = true;
	    Z_SELECT_GUIDE.visible = true;
			for (let i = 0; i < 2; i++) {
				X_SELECT_GUIDE.geometry.vertices[i].setY(SELECTION.y);
				X_SELECT_GUIDE.geometry.vertices[i].setZ(SELECTION.z);
				Y_SELECT_GUIDE.geometry.vertices[i].setX(SELECTION.x);
				Y_SELECT_GUIDE.geometry.vertices[i].setZ(SELECTION.z);
				Z_SELECT_GUIDE.geometry.vertices[i].setX(SELECTION.x);
				Z_SELECT_GUIDE.geometry.vertices[i].setY(SELECTION.y);
			}
			X_SELECT_GUIDE.geometry.verticesNeedUpdate = true;
			Y_SELECT_GUIDE.geometry.verticesNeedUpdate = true;
			Z_SELECT_GUIDE.geometry.verticesNeedUpdate = true;
		} else {
			X_SELECT_GUIDE.visible = false;
			Y_SELECT_GUIDE.visible = false;
			Z_SELECT_GUIDE.visible = false;
		}
  } else {
    if (!SELECTED[0]) X_SELECT_NODE.visible = false;
    if (!SELECTED[1]) Y_SELECT_NODE.visible = false;
    if (!SELECTED[2]) Z_SELECT_NODE.visible = false;
  }
}

function selectionClick(intersects) {
  if (SELECTED_COUNT != 3 && intersects && intersects.length > 0) {
    X_SELECT_NODE.visible = true;
    Y_SELECT_NODE.visible = true;
    Z_SELECT_NODE.visible = true;
    switch(intersects[0].object.name) {
      case X_PLANE.name:
        // Fix y and z; set x conditionally
        SELECTED[0] = (SELECTED_COUNT < 2) ? SELECTED[0] : true;
        SELECTED[1] = true;
        SELECTED[2] = true;
        SELECTED_COUNT = (SELECTED[0]) ? 3 : 2;
        break;
      case Y_PLANE.name:
        // Fix x and z; set y conditionally
        SELECTED[0] = true;
        SELECTED[1] = (SELECTED_COUNT < 2) ? SELECTED[1] : true;
        SELECTED[2] = true;
        SELECTED_COUNT = (SELECTED[1]) ? 3 : 2;
        break;
      case Z_PLANE.name:
        // Fix x and y; set z conditionally
        SELECTED[0] = true;
        SELECTED[1] = true;
        SELECTED[2] = (SELECTED_COUNT < 2) ? SELECTED[2] : true;
        SELECTED_COUNT = (SELECTED[2]) ? 3 : 2;
        break;
      default:
        console.log("Error: Bad plane intersection");
    }

		// Advance planes as necessary
		if (SELECTED[0]) {
			shiftPlane(X_PLANE, SELECTION.x, 0);
		}
		if (SELECTED[1]) {
			shiftPlane(Y_PLANE, SELECTION.y, 1);
		}
		if (SELECTED[2]) {
			shiftPlane(Z_PLANE, SELECTION.z, 2);
		}
  } else {
    // Unselect
		selectionReset();
  }
}

function selectionReset() {
	// Reset planes
	shiftPlane(X_PLANE, 0, 0);
	shiftPlane(Y_PLANE, 0, 1);
	shiftPlane(Z_PLANE, 0, 2);

	// Reset constants
	SELECTED = [false, false, false];
	SELECTED_COUNT = 0;
	X_SELECT_GUIDE.visible = false;
	Y_SELECT_GUIDE.visible = false;
	Z_SELECT_GUIDE.visible = false;
}
