
// Non-negative modulo over scale size
function pitch_to_pitchClass( pitch ) {
  return (((pitch % SCALE_SIZE) + SCALE_SIZE) % SCALE_SIZE);
}

// Dynamically add dropdown options to gui
// From: https://stackoverflow.com/questions/18260307/dat-gui-update-the-dropdown-list-values-for-a-controller
function updateDropdown(target, list, child) {
  innerHTMLStr = "";
  for (let i = 0; i < list.length; i++) {
    let str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
    innerHTMLStr += str;
  }
  innerHTMLStr += "";

  if (innerHTMLStr != "") target.__controllers[child].domElement.firstChild.innerHTML = innerHTMLStr;
}

function shiftPlane(plane, new_pos, axis) {
  let old_pos = plane.userData.pos;
  // Shift based on distance between current location and new location
  switch (axis) {
    case 0: // U
      plane.translateX(new_pos - old_pos);
      break;
    case 1: // Y
      plane.translateY(new_pos - old_pos);
      break;
    case 2: // Z
      plane.translateZ(new_pos - old_pos);
      break;
  }
  // Update current location in user data
  plane.userData.pos = new_pos;
}
