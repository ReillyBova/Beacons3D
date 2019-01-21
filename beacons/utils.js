
// Non-negative modulo over scale size
function pitch_to_pitchClass( pitch ) {
  return (((pitch % SCALE_SIZE) + SCALE_SIZE) % SCALE_SIZE);
}

// Dynamically add dropdown options to gui
// From: https://stackoverflow.com/questions/18260307/dat-gui-update-the-dropdown-list-values-for-a-controller
function updateDropdown(target, list, child) {
  innerHTMLStr = "<select>";
  for (let i = 0; i < list.length; i++) {
    let str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
    innerHTMLStr += str;
  }
  innerHTMLStr += "</select>";

  if (innerHTMLStr != "") target.__controllers[child].domElement.innerHTML = innerHTMLStr;
}
