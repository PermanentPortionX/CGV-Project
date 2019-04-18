var PLANE_WIDTH = 50,
 PLANE_LENGTH = 1000,
 PADDING = PLANE_WIDTH / 5 * 2,
 POWERUP_COUNT = 10;

var axishelper = {},
    camera = {},
    $container = {},
    controls = {},
    containerWidth = 0,
    containerHeight = 0,
    directionalLight = {},
    globalRenderID = {},
    hero = {}, //Hero is the player, we can always change this
    hemisphereLight = {},
    mountain = {},
    mountains = [],
    plane = {},
    planeGeometry = {},
    planeMaterial = {},
    powerup = {},
    powerups = [], //Powerup is the life of our player(hero)
    powerupSpawnIntervalID = {},
    powerupCounterIntervalID = {},
    queue = {},
    renderer = {},
    scene = {},
    sky = {},
    skyGeometry = {},
    skyMaterial = {},
    skyTexture = {};

//This function is for the sole purpose of rendering
function render () {
    globalRenderID = requestAnimationFrame( render ); //How are we rendering globally
    controls.update(); // We are updating the controls as we render different parts

    powerups.forEach( function ( element, index ) {
        powerups[ index ].animate(); // This is our life span, only one in the case
    });

    mountains.forEach( function ( element, index ) { //We are rendering the mountains as our world and scene progresses
        mountains[ index ].animate();
    });

    if ( detectCollisions( powerups ) === true ) { //if we touch an obstacle, it's game over
        gameOver();
    }

    renderer.render( scene, camera ); // I dont get this line yet
}
function startPowerupLogic () { //I do not get what powerups are we doing here#####################
    powerupSpawnIntervalID = window.setInterval( function () {

        if ( powerups.length < POWERUP_COUNT ) {
            powerup = new PowerUp();
            powerups.push( powerup );
            scene.add( powerup );
        }

    }, 4000 );

    powerupCounterIntervalID = window.setInterval( function () {
        POWERUP_COUNT += 1;
    }, 30000 );
}

function gameOver () { //This is the code called when the game has ended
    cancelAnimationFrame( globalRenderID );
    window.clearInterval( powerupSpawnIntervalID );
    window.clearInterval( powerupCounterIntervalID );
    //Removed some code here $('#btn-restart')..
    powerups = []; //The life has been reset
    hero.position.x = 0;  //our player starts back at position 0
    render();
    startPowerupLogic();

}

function onWindowResize () { // stack overflow says i need it, I do not know why yet. I think for screen dynamic resizing
    containerWidth = $container.innerWidth();
    containerHeight = $container.innerHeight();
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    renderer.clear();
    renderer.setSize( containerWidth, containerHeight );
}

function detectCollisions( objects ) {
    var origin = hero.position.clone();

    for ( var v = 0, vMax = hero.geometry.vertices.length; v < vMax; v += 1 ) {
        var localVertex = hero.geometry.vertices[ v ].clone();
        var globalVertex = localVertex.applyMatrix4( hero.matrix );
        var directionVector = globalVertex.sub( hero.position );

        var ray = new THREE.Raycaster( origin, directionVector.clone().normalize() );
        var intersections = ray.intersectObjects( objects );
        if ( intersections.length > 0 && intersections[ 0 ].distance < directionVector.length() ) { //check the distance of the object relative to the object
            return true;
        }
    }
    return false;
}