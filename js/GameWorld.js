let scene = null;
let camera = null;
let renderer = null;
let ground = null;
let paused = false;
let lastPos = -6;

let powerTrack = 0;

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


    const geo = new THREE.BoxGeometry(5, 0.1, lastPos, 4, 4, 4);
    const texture = new THREE.TextureLoader().load("textures/environment/ground_texture.jpg");
    const mat = new THREE.MeshBasicMaterial({map: texture});
    ground = new THREE.Mesh( geo, mat );

    scene.add( ground );
    scene.add( buildBall() );

    const cameraRayCaster = new THREE.Raycaster();
    cameraRayCaster.set(camera.position, new THREE.Vector3(0, 1, 0));
    const cIntersect = cameraRayCaster.intersectObject(ground);

    camera.position.y = cIntersect[0].point.y + 1.5;
}

//builds more scenes in the world
function growWorld(){
    const newCube = ground.clone();
    newCube.position.z = lastPos;
    scene.add(newCube);

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