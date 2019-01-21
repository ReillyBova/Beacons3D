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
