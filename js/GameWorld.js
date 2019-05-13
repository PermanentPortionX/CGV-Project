//game variables
let scene = null;
let camera = null;
let renderer = null;

//planes that show the state of life and power ups
let lifePlane = null;
let powerUpLifePlane = null;

//variable holds the whole gauge the appears at the top of the game
//gauge holds the life and power up tracker
let statesGauge = null;

//var keeps track of the view, user can use RPG or FPS view
let FPSView = false;

//element positionInScene
let defaultLifeGaugePositionZ = -1;
let defaultCameraPositionZ = 3;
let defaultCameraPositionY;

//var for power ups
let heart = null;
let shield = null;

//sound effects
let jumpSoundEffect = null;
let explosionSoundEffect = null;
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
let trap = null;

//for font
let font = null;

//scoreboard
let scoreTracker = 0;
let actualScore = 0;

//var for skyBox
let skyBox = null;

//adds light into the scene
let pl = null;//point light var

function addLighting(){

    pl = new THREE.PointLight( 0x666666, 1, 100, 2);
    pl.position.set( 0, 10, 0 );
    pl.castShadow = true;            // default false
    scene.add( pl );

//Set up shadow properties for the light
    pl.shadow.mapSize.width = 712;
    pl.shadow.mapSize.height = 712;
    pl.shadow.camera.near = 0.5;
    pl.shadow.camera.far = 100;

    //add ambient light
    scene.add(new THREE.AmbientLight(0x666666, 2.2));
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
    const treeMesh  = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x2b1d0e}));
    treeMesh.castShadow = true;
    return treeMesh;
}

//draws the ground by drawing a cube and setting ground texture to it
//then returns an object 3d
function buildGround(){
    const groundObj = new THREE.Object3D();

    //builds the normal ground
    const normalGroundGeo = new THREE.BoxGeometry(5, 0.1, lastPos, 4, 4, 4);
    const normalGroundMat = new THREE.MeshLambertMaterial({map: makeTexture("textures/environment/ground_texture.jpg")});
    const normalGround = new THREE.Mesh(normalGroundGeo, normalGroundMat);

    //dummyGround used for rayCasting to measure the distance between objects and the ground
    dummyGround = normalGround.clone();

    //create a new box that will sit on top of the normal box
    //
    const shadowGeo = new THREE.BoxGeometry(5, 0.1, lastPos, 4, 4, 4);
    const shadowMat = new THREE.ShadowMaterial();
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.opacity = 0.2;
    shadowMesh.receiveShadow = true;

    groundObj.add(normalGround);
    groundObj.add(shadowMesh);


    return groundObj;
}

//draws the side of the ground by drawing a cube and setting dried grass texture to it
//then returns the Mesh Object
function buildGroundSides() {
    const geo = new THREE.BoxGeometry(15, 0.1, lastPos, 4, 4, 4);
    const grassTexture = makeTexture("textures/environment/grass.jpg");
    const gMat = new THREE.MeshLambertMaterial({map: grassTexture});
    const ground = new THREE.Mesh(geo, gMat);
    ground.receiveShadow = true;
    return ground;
}

//positions camera relative to the ground, this function uses cameraRayCasting to intersect
//the ground with camera and get the intersection position, the intersection happens between
//the cameras origin and ground origin, after getting the position of intersection, we set
//the y value of the intersection to the cameras y
function positionCameraWithRespectToGround(){
    const cameraRayCaster = new THREE.Raycaster();
    cameraRayCaster.set(camera.position, new THREE.Vector3(0, 1, 0));
    const cIntersect = cameraRayCaster.intersectObject(dummyGround);
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

//initialize the powerUps used in the game
//-- PARENT OF BUILD FUNCTIONS: POWERUPS.JS
function initPowerUps(){
    heart = buildHeart();
    trap = buildTrap();
    shield = buildShield();
}

//draw a power up and life gauge
function drawStatesGauge(){
    //scene that holds all objects of the life gauge and power up
    const gaugeObj = new THREE.Scene();

    //builds black background of gauge
    const backGeo = new THREE.PlaneGeometry( 1.4, 0.5 );
    const backMat = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
    const backgroundPlane = new THREE.Mesh( backGeo, backMat );
    gaugeObj.add(backgroundPlane);

    //builds red plane gauge, measures the life the hero has remaining
    const frontGeo = new THREE.PlaneGeometry( 1,0.15);
    const frontMat = new THREE.MeshBasicMaterial( {color: 0xef1a1a, side: THREE.DoubleSide} );
    lifePlane = new THREE.Mesh( frontGeo, frontMat );
    gaugeObj.add(lifePlane);

    //builds blue plane gauge, measures the amount of shield the hero has remaining
    const shieldGeo = new THREE.PlaneGeometry( 1,0.15);
    const shieldMat = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
    powerUpLifePlane = new THREE.Mesh(shieldGeo, shieldMat);
    gaugeObj.add(powerUpLifePlane);

    //builds a heart icon
    let heartShape = new THREE.Shape();

    let x = 0, y = 0;
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

    //position the heart
    heartMesh.scale.set(0.025,-0.025,1);
    heartMesh.position.x = 0;
    heartMesh.position.y = 2.75;
    heartMesh.position.z = -2;

    //position all gauges
    backgroundPlane.position.set(0.85,3.15,-3);
    lifePlane.position.set(0.9,3.25,-3);
    powerUpLifePlane.position.set(0.9, 3.05, -3);
    powerUpLifePlane.scale.set(0, 1, 1);

    gaugeObj.add(heartMesh); //add the heart to the gaugeObj
    return gaugeObj;

}

//builds and initializes world(ground, side ground, trees, ball) components
function buildWorldComponentsAndAddToScene() {

    //builds the center ground which is mainly the track
    ground = buildGround();
    //builds the left and right side of the track
    rightSide = buildGroundSides();
    leftSide = rightSide.clone();

    //position the sides to left and right side
    leftSide.position.x = -10;
    rightSide.position.x = 10;

    //build trees that appear on the left and right side
    rightTree = buildTree();
    rightTree.scale.set(0.3, 0.3, 0.3);
    leftTree = buildTree();
    leftTree.scale.set(0.3, 0.3, 0.3);
    rightTree.position.x = 4;
    leftTree.position.x = -4;


    statesGauge = drawStatesGauge();
    statesGauge.position.x = -1;
    statesGauge.position.y = 3;
    statesGauge.position.z = defaultLifeGaugePositionZ;

    scene.add( leftTree );
    scene.add( rightTree );
    scene.add( rightSide );
    scene.add( leftSide );
    scene.add( ground );
    scene.add( statesGauge );
    scene.add( buildBall() );//-- PARENT OF BUILD FUNCTIONS: HERO_BALL.JS --\\
}

//adds background music to the background of scene
function addBackgroundMusic() {
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio( listener );
    backgroundMusic = new Audio( 'sounds/background_music.ogg' );
    //set music to auto replay
    backgroundMusic.loop = true;
    backgroundMusic.play();
    audio.setMediaElementSource( backgroundMusic );
}

//initialize all sound effects used in game play
function initSoundEffects() {
    jumpSoundEffect = document.getElementById("audio");
    jumpSoundEffect.volume = 0.4;

    explosionSoundEffect = document.getElementById("ballExplosion");
    explosionSoundEffect.volume = 0.4;
}

//initialize the world
function initGameWorld() {
    const loader = new THREE.FontLoader();
    //loads the font used in the game for level text
    loader.load('fonts/Harabara_Regular.json', function (res) {
        font = res;
        //after font loads, the scene is built
        //builds the world /-- PARENT: GAME WORLD --\
        initWorld();
        //initialize key press /-- PARENT: KEYBOARD CONTROLS --\
        initKeyboard();
    });
}

//automatically resize the scene when the window resize
function addWindowResizeListener() {
    window.addEventListener('resize', onResize, false);
    document.body.appendChild( renderer.domElement );
}

function initWorld(){
    //initialize the game vars
    scene = new THREE.Scene( );
    scene.fog = new THREE.FogExp2( 0xC8A166, 0.05, 2);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = defaultCameraPositionZ;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    //skyBox
    let skyGeo = new THREE.CubeGeometry(1000, 1000, 1000);
    let cubeMats = [
        new THREE.MeshBasicMaterial({ map: makeTexture("textures/skybox/back.png"), side: THREE.DoubleSide, fog: false}),
        new THREE.MeshBasicMaterial({ map: makeTexture("textures/skybox/front.png"), side: THREE.DoubleSide, fog: false}),
        new THREE.MeshBasicMaterial({ map: makeTexture("textures/skybox/top.png"), side: THREE.DoubleSide, fog: false}),
        new THREE.MeshBasicMaterial({ map: makeTexture("textures/skybox/bottom.png"), side: THREE.DoubleSide, fog: false}),
        new THREE.MeshBasicMaterial({ map: makeTexture("textures/skybox/right.png"), side: THREE.DoubleSide, fog: false}),
        new THREE.MeshBasicMaterial({ map: makeTexture("textures/skybox/left.png"), side: THREE.DoubleSide, fog: false})
    ];

    skyBox = new THREE.Mesh(skyGeo, cubeMats);

    scene.add(skyBox);

    //listens for window size changes and readjust the scenes size according to the new given sizes
    addWindowResizeListener();

    //builds, positions, adds all required components into the world
    initSoundEffects();
    buildWorldComponentsAndAddToScene();
    initObstacles();
    initPowerUps();
    addLighting();
    positionCameraWithRespectToGround();
    buildGame();

}

//draws the scene
function render () {
    renderer.render(scene, camera)
}

//updates positions of elements in the world, to depict animation
function updateWorldElements() {
    //update position of ball
    ball.rotation.x -= gameSpeed;
    ball.position.z -= gameSpeed;

    //update position of shield according to ball position
    heroShield.position.x = ball.position.x;
    heroShield.position.y = ball.position.y + 0.3;

    //move point light together with light
    pl.position.z = ball.position.z;

    //move the defaultCameraZ and defaultLifeGaugeZ into the scene
    defaultCameraPositionZ -= gameSpeed;
    defaultLifeGaugePositionZ -= gameSpeed;

    if (FPSView) {//First person shooter view activated
        //camera and life gauge position set to the same coordinates as ball
        camera.position.z = ball.position.z;
        camera.position.x = ball.position.x;
        camera.position.y = ball.position.y;
        statesGauge.position.z = ball.position.z - 1.8;
        statesGauge.position.y = ball.position.y;
        statesGauge.position.x = ball.position.x - 0.4;
    }
    else {//First person shooter view deactivated
        //camera and life gauge position set to their default positions
        camera.position.z = defaultCameraPositionZ;
        camera.position.y = defaultCameraPositionY;
        camera.position.x = 0;
        statesGauge.position.z = defaultLifeGaugePositionZ;
        statesGauge.position.x = -1;
        statesGauge.position.y = 3;
        heroShield.position.z = ball.position.z - 0.2;
        heroShield.position.y += 0.2;
    }

    //update position of skybox to move together with the camera
    skyBox.position.x = camera.position.x;
    skyBox.position.z = camera.position.z;
}

//rebuilds the scene every time ball is arriving the end of track
function checkIfSceneHasTOBeRebuild(){
    let distanceToEnd = Math.abs(lastPos) - Math.abs(ball.position.z);
    if (distanceToEnd <= 40) buildGame();
}

//updates the score in the scoreboard overlay
function updateScore(){
    scoreTracker++;
    actualScore += Math.abs(scoreTracker - Math.round(scoreTracker * (1 - gameSpeed)) - actualScore);
    //updates score in overlay
    document.getElementById("scoreText").innerHTML = "<img src=\"textures/score_board/the_edge_score_icon.png\"" +
        " alt=\"\" width=\"20\" height=\"20\">"+": "+ actualScore.toString();
}

//updates all the world components
function update() {
    ///--PARENT: HERO BALL --\
    if (dead){
        //Handles balls death animation: --PARENT: HERO BALL --\
        handleDeath();
    }

    if (!paused) {
        //updates the score
        updateScore();

        checkIfSceneHasTOBeRebuild();

        //updates ball position according to which key is pressed /-- PARENT: KEYBOARD CONTROLS --\
        updateBallPositionAccordingToKeyPress();

        //checks if the ball is back on the ground for when it jumps /--PARENT: HERO BALL --\
        //resets the jump velocity and gravity /--PARENT: KEYBOARD CONTROLS --\
        if (ballBackToGround()) resetJumpVarsToDefault();

        //update shield life if active
        updateHeroShieldIfActive();

        //updates the balls life per frame
        updateBallLife();

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