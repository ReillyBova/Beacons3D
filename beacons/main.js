// Launch program
init();

function init() {
  // Create scene
	SCENE = new THREE.Scene();

  // Initialize renderer
  RENDERER = new THREE.WebGLRenderer( { antialias: true } );
	RENDERER.setPixelRatio( window.devicePixelRatio );
	RENDERER.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( RENDERER.domElement );

  // Initialize raycaster for mouse intersections
  MOUSE = new THREE.Vector2();
  RAYCASTER = new THREE.Raycaster();
	RAYCASTER.linePrecision = 3;

  // Initialize camera
	CAMERA = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, NEAR, FAR);

  // Initialize controls
  CONTROLS = new THREE.OrbitControls( CAMERA, RENDERER.domElement );
  CAMERA.position.set(...DEFAULT_CAMERA_POS); // '...' spread operator unpacks array
	CONTROLS.target = new THREE.Vector3(1e-3, 1e-3, 1e-3);
	CONTROLS.enablePan = false;
	CONTROLS.maxPolarAngle = Math.PI / 2.0;
	CONTROLS.minAzimuthAngle = 0;
	CONTROLS.maxAzimuthAngle = Math.PI / 2.0;
	CONTROLS.maxDistance = FAR / 2.0;
  CONTROLS.update();

  // Initialize framerate statistics
  STATS = new Stats();
  document.body.appendChild( STATS.dom );

  // Initialize background
	SCENE.background = new THREE.Color( 0x0 );
  // Build icosahedron geometry for background
  const backgroundGeometry = new THREE.IcosahedronBufferGeometry( FAR / 2.0, 5 );
  const backgroundWireframe = new THREE.WireframeGeometry( backgroundGeometry );
  const backgroundMaterial = new THREE.LineBasicMaterial( { color: 0x555555, linewidth: 2, depthTest: true,
                                                          opacity: 0.25, transparent: true } );
  const backgroundLines = new THREE.LineSegments( backgroundWireframe, backgroundMaterial );
  // Add background geometry into scene
  SCENE.add( backgroundLines );

  // Initialize event listeners
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

	// Initialize GUI
	INPUT = new UserInterface();
	GUI = new dat.GUI();
	initGui();

	// Initialize Game
	initGame();

  // Start game loop
  run();
}

// Main loop
function run() {
  // Trigger recursive callback on next frame when current frame finishes buffering
	requestAnimationFrame( run );

	// Handle selection intersections
	raycast();

	// Update screen
	render();
	STATS.update();
}

function raycast() {
	// Find intersections with axes
	RAYCASTER.setFromCamera( MOUSE, CAMERA );
	/*var intersects = raycaster.intersectObjects( parentTransform.children, true );*/
}

function render() {
  CONTROLS.update();
	RENDERER.render( SCENE, CAMERA );
}
