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

function drawGround(){
    const geo = new THREE.BoxGeometry(5, 0.1, lastPos, 4, 4, 4);
    const texture = makeTexture("textures/environment/ground_texture.jpg");
    const mat = new THREE.MeshBasicMaterial({map: texture});
    return new THREE.Mesh( geo, mat );
}

function drawGroundSides() {
    const geo = new THREE.BoxGeometry(15, 0.1, lastPos, 4, 4, 4);
    const grassTexture = makeTexture("textures/environment/grass.jpg");
    const gMat = new THREE.MeshBasicMaterial({map: grassTexture});
    return  new THREE.Mesh(geo, gMat);
}

function positionCameraWithRespectToGround(){
    const cameraRayCaster = new THREE.Raycaster();
    cameraRayCaster.set(camera.position, new THREE.Vector3(0, 1, 0));
    const cIntersect = cameraRayCaster.intersectObject(ground);

    camera.position.y = cIntersect[0].point.y + 1.5;
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


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

    //var listener = new THREE.AudioListener();
    //camera.add( listener );


// create a global audio source
    /*var sound = new THREE.Audio( listener );

    window.onload = function() {
        // load a sound and set it as the Audio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'sounds/background_music.ogg', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.play();
        });
    };*/


}


//builds more scenes in the world
function growWorld(){

    /*if (ball.position.z - lastPos > 39) return;

    lastPos += 6;
    for(let j = 0; j < 20; j++){
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
        lastPos -= 6;

        //const smallS = lowHurdle.clone();
        //smallS.position.z = lastPos;
        //scene.add(smallS);

        const smallSpikes = buildLargeSpikes();
        smallSpikes.position.z = lastPos;
        smallSpikes.scale.set(0.2, 0.2, 0.2);
        scene.add(smallSpikes);
    }*/

    /*const newGround = ground.clone();
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
    scene.add( newLeftTree );*/
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


    /*var context = null;
    window.onload = function() {
        context = new AudioContext();
        if (context !== null){
            context.resume();
        }
    };
    document.querySelector('button').addEventListener('click', function() {
        context.resume().then(() => {
            console.log('Playback resumed successfully');
        });
    });*/
};