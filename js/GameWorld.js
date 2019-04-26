let scene = null;
let camera = null;
let renderer = null;
let ground = null;
let rightTree = null;
let leftTree = null;
let rightSide = null;
let leftSide = null;
let paused = false;
let lastPos = -6;

let powerTrack = 0;

//for obstacles
let smallSpikes = null;
let mediumSpikes = null;
let largeSpikes = null;
let cube = null;
let lowHurdle = null;
let highHurdle = null;
let wall = null;


//adds directional sun light into the scene
function addSunLight(){
    scene.add( new THREE.DirectionalLight( 0xffffff, 0.5 ) );
}

//this function draws a tree
function drawTree(){
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
function drawGround(){
    const geo = new THREE.BoxGeometry(5, 0.1, lastPos, 4, 4, 4);
    const texture = makeTexture("textures/environment/ground_texture.jpg");
    const mat = new THREE.MeshBasicMaterial({map: texture});
    return new THREE.Mesh( geo, mat );
}

//draws the side of the ground by drawing a cube and setting dried grass texture to it
//then returns the Mesh Object
function drawGroundSides() {
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
    camera.position.y = cIntersect[0].point.y + 1.5;
}

//responsible for auto resizing the scene when the browsers size changes
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//initializes the obstacles used in the game
function initObstacles() {
    smallSpikes = buildSmallSpikes();
    smallSpikes.scale.set(0.2, 0.2, 0.2);

    mediumSpikes = buildMediumSpikes();
    mediumSpikes.scale.set(0.2, 0.2, 0.2);

    largeSpikes = buildLargeSpikes();
    largeSpikes.scale.set(0.2, 0.2, 0.2);

    cube = drawCube();
    cube.scale.set(0.5, 0.5, 0.5);

    wall = drawCube();
    wall.scale.set(1, 1.8, 0.1);

    lowHurdle = buildLowHurdle();
    lowHurdle.position.y += 1;
    lowHurdle.scale.set(0.5, 0.5, 0.5);

    highHurdle = buildHighHurdle();
}

function initWorld(){
    scene = new THREE.Scene( );
    scene.fog = new THREE.FogExp2( 0xfaf1e0, 0.05, 2);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    window.addEventListener('resize', onResize, false);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor(0xfaf1e0, 1);
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild( renderer.domElement );

    camera.position.z = 3;

    ground = drawGround();
    rightSide = drawGroundSides();
    leftSide = rightSide.clone();
    leftSide.position.x = -10;
    rightSide.position.x = 10;

    rightTree = drawTree();
    rightTree.scale.set(0.3, 0.3, 0.3);
    leftTree = rightTree.clone();
    rightTree.position.x = 4;
    leftTree.position.x = -4;

    scene.add( leftTree );
    scene.add( rightTree );
    scene.add( rightSide );
    scene.add( leftSide );
    scene.add( ground);
    scene.add( buildBall() );

    initObstacles();

    addSunLight();

    positionCameraWithRespectToGround();

    buildGame();

}




//draws the scene
function render () {
    renderer.render(scene, camera)
}

//updates positions of elements in the world
function updateWorldElements() {
    ball.rotation.x -= 0.3;
    ball.position.z -= 0.3;
    camera.position.z -= 0.3;
}

function update() {
    //if (paused) return;
    if (!paused) {
        //updates ball position according to which key is pressed /-- PARENT: KEYBOARD CONTROLS --\
        updateBallPositionAccordingToKeyPress();

        //checks if the ball is back on the ground for when it jumps /--PARENT: HERO BALL --\
        if (ballBackToGround()){
            //resets the jump velocity and gravity /--PARENT: KEYBOARD CONTROLS --\
            resetJumpVarsToDefault();
        }

        //updates positions of elements in the world e.g. ball, camera, etc /--PARENT: GAME WORLD --\
        updateWorldElements();
    }


}

//describes how the gaming will be taking place
let GameLoop = function() {
    requestAnimationFrame(GameLoop);
    update();
    render();
};