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

function addSunLight(){

    scene.add( new THREE.DirectionalLight( 0xffffff, 0.5 ) );
}

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

function drawGround(){
    const geo = new THREE.BoxGeometry(5, 0.1, lastPos, 4, 4, 4);
    const texture = new THREE.TextureLoader().load("textures/environment/ground_texture.jpg");
    const mat = new THREE.MeshBasicMaterial({map: texture});
    return ground = new THREE.Mesh( geo, mat );
}

function drawGroundSides() {
    const geo = new THREE.BoxGeometry(5, 0.1, lastPos, 4, 4, 4);
    const grassTexture = new THREE.TextureLoader().load("textures/environment/grass.jpg");
    const gMat = new THREE.MeshBasicMaterial({map: grassTexture});
    return  new THREE.Mesh(geo, gMat);
}

function positionCameraWithRespectToGround(){
    const cameraRayCaster = new THREE.Raycaster();
    cameraRayCaster.set(camera.position, new THREE.Vector3(0, 1, 0));
    const cIntersect = cameraRayCaster.intersectObject(ground);

    camera.position.y = cIntersect[0].point.y + 1.5;
}

function initWorld(){
    scene = new THREE.Scene( );
    scene.fog = new THREE.FogExp2( 0xfaf1e0, 0.05, 2);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor(0xfaf1e0, 1);
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild( renderer.domElement );

    camera.position.z = 3;

    rightSide = drawGroundSides();
    leftSide = rightSide.clone();
    leftSide.position.x = -5;
    rightSide.position.x = 5;

    rightTree = drawTree();
    rightTree.scale.set(0.3, 0.3, 0.3);
    leftTree = rightTree.clone();
    rightTree.position.x = 4;
    leftTree.position.x = -4;

    scene.add( leftTree );
    scene.add( rightTree );
    scene.add( rightSide );
    scene.add( leftSide );
    scene.add( drawGround() );
    scene.add( buildBall() );

    addSunLight();

    positionCameraWithRespectToGround();
}


//builds more scenes in the world
function growWorld(){
    const newGround = ground.clone();
    newGround.position.z = lastPos;
    scene.add( newGround );

    const newRightSide = rightSide.clone();
    newRightSide.position.z = lastPos;
    scene.add( newRightSide );

    const newLeftSide = leftSide.clone();
    newLeftSide.position.z = lastPos;
    scene.add( newLeftSide );

    const newRightTree = rightTree.clone();
    newRightTree.position.z = lastPos;
    scene.add( newRightTree );

    const newLeftTree = leftTree.clone();
    newLeftTree.position.z = lastPos;
    scene.add( newLeftTree );
    /*if (powerTrack === 0){
        const Bomb = trap();
        Bomb.position.z = -70;

        Bomb.position.y = positionJustAboveGround + 0.3;
        scene.add(Bomb);
    }*/



    lastPos -= 6;
    //powerTrack++;
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

    //updates ball position according to which key is pressed /-- PARENT: KEYBOARD CONTROLS --\
    updateBallPositionAccordingToKeyPress();

    //checks if the ball is back on the ground for when it jumps /--PARENT: HERO BALL --\
    if (ballBackToGround()){
        //resets the jump velocity and gravity /--PARENT: KEYBOARD CONTROLS --\
        resetJumpVarsToDefault();
    }

    //grows the world by building more objects /--PARENT: GAME WORLD --\
    growWorld();

    //updates positions of elements in the world e.g. ball, camera, etc /--PARENT: GAME WORLD --\
    updateWorldElements();

}

//describes how the gaming will be taking place
let GameLoop = function() {
    requestAnimationFrame(GameLoop);
    update();
    render();
};