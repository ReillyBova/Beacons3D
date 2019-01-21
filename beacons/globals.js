// Graphics Constants
const FOV = 70;
const NEAR = 1;
const FAR = 1000;
const DEFAULT_CAMERA_POS = [ 100, 130, 160 ];

// Graphics Globals
var SCENE, RENDERER, MOUSE, RAYCASTER, CONTROLS, CAMERA, STATS, GUI, BLOOMPASS, COMPOSER;

// Object Globals
var X_PLANE, Y_PLANE, Z_PLANE, PLANES;
var X_AXIS, Y_AXIS, Z_AXIS, AXES;
var X_SELECT_GUIDE, Y_SELECT_GUIDE, Z_SELECT_GUIDE;
var X_SELECT_NODE, Y_SELECT_NODE, Z_SELECT_NODE;

// Game Constants
const DEFAULT_SCALE = '0 4 5 8 11';
const SCALE_SIZE = 12;
const MIDI_MAX = 128;
const FREQUENCY = 500;

// Game Globals
var INPUT, SELECTION, MIDI;
var CURRENT_BEACON;
var BEACONS = [];
var SCALE = [];
var SCALE_HISTORY = [];
var NOTES = [];
var MIN_NOTE = 36;
var MAX_NOTE = 76;
var SELECTED = [false, false, false];
var SELECTED_COUNT = 0;
