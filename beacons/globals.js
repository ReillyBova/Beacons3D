// Graphics Constants
const FOV = 70;
const NEAR = 1;
const FAR = 10000;
const DEFAULT_CAMERA_POS = [ 100, 130, 160 ];

// Graphics Globals
var SCENE, RENDERER, MOUSE, RAYCASTER, CONTROLS, CAMERA, STATS, GUI;

// Object Globals
var X_PLANE, Y_PLANE, Z_PLANE, PLANES;
var X_AXIS, Y_AXIS, Z_AXIS, AXES;

// Game Constants
const DEFAULT_SCALE = '0 4 5 8 11';
const SCALE_SIZE = 12;
const MIDI_MAX = 128;

// Game Globals
var INPUT, SELECTION;
var SCALE = [];
var SCALE_HISTORY = [];
var NOTES = [];
var MIN_NOTE = 36;
var MAX_NOTE = 76;
