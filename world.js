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

/*function getRandomInteger( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}*/

function Hero () { //This is our player function in the world
    var hero = {},
        heroGeometry = {}, //The player's point in 3D space
        heroMaterial = {}; // What the player is made of

    heroGeometry = new THREE.CylinderGeometry( 0, 2, 5, 10 );
    heroMaterial = new THREE.MeshLambertMaterial( {
        color: 0xE91E63, //This is the colour of our player. change for different colors
        shading: THREE.FlatShading //smoothen it out using flat shading
    } );
    hero = new THREE.Mesh( heroGeometry, heroMaterial ); //the new object of our player
    hero.castShadow = true; //we want the play to a have a shadow
    hero.position.set( 0, 5, ( PLANE_LENGTH / 2 ) ); //the constant position of our player in (x,y,z)
    hero.rotation.x = 0.785; // do not know what is this for

    window.addEventListener( 'keydown', function () {
        if ( event.keyCode === 37 && hero.position.x !== -( PLANE_WIDTH - PADDING ) / 2 ) {
            hero.position.x -= ( PLANE_WIDTH - PADDING ) / 2;
        } else if ( event.keyCode === 39 && hero.position.x !== ( PLANE_WIDTH - PADDING ) / 2 ) {
            hero.position.x += ( PLANE_WIDTH - PADDING ) / 2;
        }
    } );

    return hero;
}

function createLandscapeFloors () { //This is similar to having scene graph but in 3D
    var planeLeft = {},
        planeLeftGeometry = {},
        planeLeftMaterial = {},
        planeRight = {};

    planeLeftGeometry = new THREE.BoxGeometry( PLANE_WIDTH, PLANE_LENGTH + PLANE_LENGTH / 10, 1 ); // we are giving the left plane the 3d effect, but we want Z=1 so its constant
    planeLeftMaterial = new THREE.MeshLambertMaterial( {
        color: 0x8BC34A //set the material color
    } );
    planeLeft = new THREE.Mesh( planeLeftGeometry, planeLeftMaterial );
    planeLeft.receiveShadow = true;
    planeLeft.rotation.x = 1.570;
    planeLeft.position.x = -PLANE_WIDTH;
    planeLeft.position.y = 1;

    planeRight = planeLeft.clone(); //We are copying what's at the LHS and implementing it on the RHS
    planeRight.position.x = PLANE_WIDTH;

    scene.add( planeLeft, planeRight ); //Add the planes to our scene
}

function createMountain ( i, isEast ) {
    var loader = {},
        prototype = {},
        object = {}, //The object and the dimensions follow below
        objectDimensionX = {},
        objectDimensionY = {},
        objectDimensionZ = {};

    loader = new THREE.ColladaLoader();

    function createObject () {
        object = prototype.clone();
        objectDimensionX = Math.random() * 0.25 + 0.05;
        objectDimensionY = Math.random() * 0.25;
        objectDimensionZ = objectDimensionX;
        object.scale.set( objectDimensionX, objectDimensionY, objectDimensionZ );

        if ( isEast === true ) { //The isEast is used for the _orientation_, to know if the object is drawn east or not
            object.position.x = PLANE_WIDTH * 2;
            object.position.z = ( i * PLANE_LENGTH / 27 ) - ( 1.5 * PLANE_LENGTH );
        } else {
            object.position.x = -PLANE_WIDTH * 2
            object.position.z = ( i * PLANE_LENGTH / 27 ) - ( PLANE_LENGTH / 2 );
        }

        object.visible = true;

        object.animate = function () {

            if ( object.position.z < PLANE_LENGTH / 2 - PLANE_LENGTH / 10 ) {
                object.position.z += 5;
            } else {
                object.position.z = -PLANE_LENGTH / 2;
            }
        }
        mountains.push( object ); //push object to the stack
        scene.add( object ); // add it to the scene graph
    }

    loader.load(
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/26757/mountain.dae', //importing the picture in code form and added to the scene
        function ( collada ) {
            prototype = collada.scene;
            prototype.visible = false;
            createObject();
        } );

}

function createSpotlights () { //I do not know what this is ######################################################
    var spotLight = {},
        target = {},
        targetGeometry = {},
        targetMaterial = {};
    for ( var i = 0; i < 5; i += 1 ) {
        targetGeometry = new THREE.BoxGeometry(1, 1, 1);
        targetMaterial = new THREE.MeshNormalMaterial();
        target = new THREE.Mesh( targetGeometry, targetMaterial );
        target.position.set( 0, 2, ( i * PLANE_LENGTH / 5 ) - ( PLANE_LENGTH / 2.5 ) );
        target.visible = false;
        scene.add( target );

        spotLight = new THREE.SpotLight( 0xFFFFFF, 2 );
        spotLight.position.set( 150, ( i * PLANE_LENGTH / 5 ) - ( PLANE_LENGTH / 2.5 ), -200 );
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 10;
        spotLight.shadowCameraVisible = false;
        spotLight.target = target;
        spotLight.shadowMapWidth = 2048;
        spotLight.shadowMapHeight = 2048;
        spotLight.fov = 40;

        plane.add( spotLight );
    }
}

function PowerUp () {
    var object = {},
        objectDimension = 0,
        objectGeometry = {},
        objectMaterial = {},
        xPosition = 0,
        xPositionValues = [],
        yPosition = 0,
        yPositionValues = [],
        zPosition = 0,
        zPositionValues = [];

    objectDimension = 2;

    xPositionValues = [ -( PLANE_WIDTH - PADDING ) / 2, 0, ( PLANE_WIDTH - PADDING ) / 2 ];
    yPositionValues = [ objectDimension + 1 ];
    zPositionValues = [ -( PLANE_LENGTH - PADDING ) / 2 ];

    xPosition = xPositionValues[ getRandomInteger( 0, xPositionValues.length - 1 ) ];
    yPosition = yPositionValues[ getRandomInteger( 0, yPositionValues.length - 1 ) ];
    zPosition = zPositionValues[ getRandomInteger( 0, zPositionValues.length - 1 ) ];

    objectGeometry = new THREE.BoxGeometry( objectDimension, objectDimension, objectDimension, objectDimension );
    objectMaterial = new THREE.MeshLambertMaterial( { //we specify the material, we could have used Phong as well
        color: 0x29B6F6,
        shading: THREE.FlatShading
    } );
    object = new THREE.Mesh( objectGeometry, objectMaterial );
    object.position.set( xPosition, yPosition, zPosition );
    object.castShadow = true;
    object.receiveShadow = true;

    object.animate = function () {

        if ( object.position.z < PLANE_LENGTH / 2 + PLANE_LENGTH / 10 ) {
            object.position.z += 10;
        } else {
            object.position.x = xPositionValues[ getRandomInteger( 0, xPositionValues.length - 1 ) ];
            object.position.z = -PLANE_LENGTH / 2;
        }

    }

    return object;
}

function startPowerupLogic () { // i still do not get this powerUpLogic, or what it does. Others are still self-explanatory
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