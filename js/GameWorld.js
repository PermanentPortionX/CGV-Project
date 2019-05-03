//game variables
let scene = null;
let camera = null;
let renderer = null;
let gameSpeed = 0.3;
let redPlane = null;
let lifeGauge = null;
let scoreBoard = null;
let lifeScaleFactor = 1;
let FPSView = false;
let defaultLifeGaugePositionZ = -1;
let defaultCameraPositionZ = 3;
let defaultCameraPositionY;

//sound effects
let jumpSoundEffect = null;
let backgroundMusic = null;

let paused = false; // keeps track of game pause and resume
let lastPos = -6; //z position of each block on the pathway, changes every time a block is drawn

//world variables
let ground = null;
let rightTree = null;
let leftTree = null;
let rightSide = null;
let leftSide = null;

//for obstacles
let spikes = null;
let cube = null;

//for font
let font = null;

//adds directional sun light into the scene
function addSunLight(){
    scene.add( new THREE.DirectionalLight( 0xffffff, 0.5 ) );
}

//this function draws a tree
function buildTree(){
    const tree = new THREE.Tree({
        generations: 4,        // # for branch' hierarchy
        length: 4.0,      // length of root branch
        uvLength: 16.0,     // uv.v ratio against geometry length (recommended is generations * length)
        radius: 0.2,      // radius of root branch
        radiusSegments: 8,     // # of radius segments for each branch geometry
        heightSegments: 8      // # of height segments for each branch geometry
    });
    const geometry = THREE.TreeGeometry.build(tree);
    return new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({}));
}

//draws the ground by drawing a cube and setting ground texture to it
//then returns the Mesh Object
function buildGround(){
    const geo = new THREE.BoxGeometry(5, 0.1, lastPos, 4, 4, 4);
    const texture = makeTexture("textures/environment/ground_texture.jpg");
    const mat = new THREE.MeshBasicMaterial({map: texture});
    return new THREE.Mesh( geo, mat );
}

//draws the side of the ground by drawing a cube and setting dried grass texture to it
//then returns the Mesh Object
function buildGroundSides() {
    const geo = new THREE.BoxGeometry(15, 0.1, lastPos, 4, 4, 4);
    const grassTexture = makeTexture("textures/environment/grass.jpg");
    const gMat = new THREE.MeshBasicMaterial({map: grassTexture});
    return  new THREE.Mesh(geo, gMat);
}

//positions camera relative to the ground, this function uses cameraRayCasting to intersect
//the ground with camera and get the intersection position, the intersection happens between
//the cameras origin and ground origin, after getting the position of intersection, we set
//the y value of the intersection to the cameras y
function positionCameraWithRespectToGround(){
    const cameraRayCaster = new THREE.Raycaster();
    cameraRayCaster.set(camera.position, new THREE.Vector3(0, 1, 0));
    const cIntersect = cameraRayCaster.intersectObject(ground);
    defaultCameraPositionY = cIntersect[0].point.y + 1.5;
    camera.position.y = defaultCameraPositionY;
}

//responsible for auto resizing the scene when the browsers size changes
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//initializes the obstacles used in the game
//-- PARENT OF BUILD FUNCTIONS: OBSTACLES.JS --\\
function initObstacles() {
    spikes = buildSpikes();
    spikes.scale.set(0.2, 0.2, 0.2);

    cube = buildCube();
    cube.scale.set(0.4, 0.4, 0.4);

}

//draw a life gauge
function drawLifeGauge(){
    const gaugeObj = new THREE.Scene();

    const backGeo = new THREE.PlaneGeometry( 1.4, 0.3 );
    const backMat = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
    const backgroundPlane = new THREE.Mesh( backGeo, backMat );
    gaugeObj.add(backgroundPlane);

    const frontGeo = new THREE.PlaneGeometry( 1,0.15);
    const frontMat = new THREE.MeshBasicMaterial( {color: 0xef1a1a, side: THREE.DoubleSide} );
    redPlane = new THREE.Mesh( frontGeo, frontMat );
    gaugeObj.add(redPlane);

    let x = 0, y = 0;

    let heartShape = new THREE.Shape();

    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );



    let heartGeo = new THREE.ShapeGeometry( heartShape );
    let heartMat = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    let heartMesh = new THREE.Mesh( heartGeo, heartMat ) ;

    heartMesh.scale.set(0.025,-0.025,1);
    heartMesh.position.x = 0;
    heartMesh.position.y = 2.75;
    heartMesh.position.z = -2;

    backgroundPlane.position.set(0.85,3.15,-3);
    redPlane.position.set(0.9,3.15,-3);
    gaugeObj.add(heartMesh); //add the heart to the gaugeObj

    return gaugeObj;

}

// draw the score board for distance covered

function drawScoreBoard(){

    const scoreObj = new THREE.Scene();

    const surfaceGeo = new THREE.PlaneGeometry(1,1);
    const surfaceMat= new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
    const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);

    scoreObj.add(surfaceMesh);
    camera.add(scoreObj);

    return scoreObj;
}

//builds and initializes world(ground, side ground, trees, ball) components
function buildWorldComponentsAndAddToScene() {

    ground = buildGround();
    rightSide = buildGroundSides();
    leftSide = rightSide.clone();
    leftSide.position.x = -10;
    rightSide.position.x = 10;

    rightTree = buildTree();
    rightTree.scale.set(0.3, 0.3, 0.3);
    leftTree = rightTree.clone();
    rightTree.position.x = 4;
    leftTree.position.x = -4;

    lifeGauge = drawLifeGauge();
    lifeGauge.position.x = -1;
    lifeGauge.position.y = 3;
    lifeGauge.position.z = defaultLifeGaugePositionZ;

    scoreBoard = drawScoreBoard();
    scoreBoard.position.x = -1;
    scoreBoard.position.y = 3;
    scoreBoard.position.z = -1;
    camera.add(scoreBoard);

    scene.add( leftTree );
    scene.add( rightTree );
    scene.add( rightSide );
    scene.add( leftSide );
    scene.add( ground);
    scene.add( lifeGauge );
    //scene.add( scoreBoard);
    scene.add( buildBall() );//-- PARENT OF BUILD FUNCTIONS: HERO_BALL.JS --\\
}

//adds background music to the background of scene
function addBackgroundMusic() {
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio( listener );
    backgroundMusic = new Audio( 'sounds/background_music.ogg' );
    backgroundMusic.loop = true;
    backgroundMusic.play();
    audio.setMediaElementSource( backgroundMusic );
}

//initialize all sound effects used in game play
function initSoundEffects() {
    jumpSoundEffect = document.getElementById("audio");
    jumpSoundEffect.volume = 0.4;
}

//load fonts to be used by level indicators
function loadFont(){
    const loader = new THREE.FontLoader();
    loader.load('fonts/Harabara_Regular.json', function (res) {
        font = res;
    });
}

function initWorld(){
    //initialize the game vars
    scene = new THREE.Scene( );
    scene.fog = new THREE.FogExp2( 0xfaf1e0, 0.05, 2);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = defaultCameraPositionZ;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xfaf1e0, 1);
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', onResize, false);

    document.body.appendChild( renderer.domElement );

    //controls = new THREE.OrbitControls( camera );

    //builds, positions, adds all required components into the world
    initSoundEffects();
    buildWorldComponentsAndAddToScene();
    initObstacles();
    addSunLight();
    positionCameraWithRespectToGround();
    buildGame();

}

//draws the scene
function render () {
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.render(scene, camera)
}

//updates positions of elements in the world, to depict animation
function updateWorldElements() {
    ball.rotation.x -= gameSpeed;
    ball.position.z -= gameSpeed;
    defaultCameraPositionZ -= gameSpeed;
    defaultLifeGaugePositionZ -= gameSpeed;
    //camera.position.z -= gameSpeed;
    //lifeGauge.position.z -= gameSpeed;
    redPlane.scale.set(lifeScaleFactor, 1, 1);
    lifeScaleFactor -= 0.0025;
    if (lifeScaleFactor <= 0) {
        lifeScaleFactor = 0;
        //paused = true;
    }

    if (FPSView) {
        camera.position.z = ball.position.z;
        camera.position.x = ball.position.x;
        camera.position.y = ball.position.y;
        lifeGauge.position.z = ball.position.z- 2;
        lifeGauge.position.y = ball.position.y;
        lifeGauge.position.x = ball.position.x;
    }
    else {

        camera.position.z = defaultCameraPositionZ;
        camera.position.y = defaultCameraPositionY;
        camera.position.x = 0;
        lifeGauge.position.z = defaultLifeGaugePositionZ;
        lifeGauge.position.x = -1;
        lifeGauge.position.y = 3;
    }
}

//updates all the world components
function update() {
    ///--PARENT: HERO BALL --\
    if (dead){

    }
    if (!paused) {
        //updates ball position according to which key is pressed /-- PARENT: KEYBOARD CONTROLS --\
        updateBallPositionAccordingToKeyPress();

        //checks if the ball is back on the ground for when it jumps /--PARENT: HERO BALL --\
        //resets the jump velocity and gravity /--PARENT: KEYBOARD CONTROLS --\
        if (ballBackToGround()) resetJumpVarsToDefault();

        //updates positions of elements in the world e.g. ball, camera, etc /--PARENT: GAME WORLD --\
        updateWorldElements();

        //update game configure if in new level, e.g. increase game speed
        updateLevelIfHeroIsInNewLevel();

        //check for collisions
        checkForCollisionsBetweenBallAndObstacles();
    }


}

//describes how the gaming will be taking place
let GameLoop = function() {
    requestAnimationFrame(GameLoop);
    update();
    render();
};