let ball = null;
let ballIntersectsWithFloor = null;
let dead = false; //keeps track of the balls life state

//for ball life
let lifeScaleFactor = 1;
let lifeDecreaseRate = 0;

//for particle explosion
let movementSpeed = 5;
let totalObjects = 2000;
let objectSize = 0.25;
let dirs = [];
let parts = [];
let shrinkAnimationNotComplete = true;//keeps track of the animation state
let ballScaleFactor = 1;//keeps track of the balls scale, (for animation of ball when it explodes, it first scales down to
// 0 then explodes )


//builds and returns the ball the user controls
function buildBall() {
    const ballTexture = new THREE.TextureLoader().load("textures/ball_textures/ball_t.jpg");
    const geometry = new THREE.SphereGeometry(0.25, 32, 32);
    const material = new THREE.MeshBasicMaterial({map: ballTexture});
    ball = new THREE.Mesh(geometry, material);

    //ball rayCaster
    //cast ray from ball to ground to get accurate position above ground
    const ballRayCaster = new THREE.Raycaster();
    ballRayCaster.set(ball.position, new THREE.Vector3(0, 1, 0));//shoots the ray
    ballIntersectsWithFloor  = ballRayCaster.intersectObject(ground);//gets the results of ray cast
    ball.position.y = ballIntersectsWithFloor[0].point.y + 0.25;
    ball.castShadow = true;
    return ball;
}

//checks if the ball is back on the ground for when a user jumps
function ballBackToGround(){
    if (ball.position.y <= ballIntersectsWithFloor[0].point.y + 0.25) {
        ball.position.y = ballIntersectsWithFloor[0].point.y + 0.25;
        return true;
    }
    return false;
}

//this methods decide if the avatar is dead or not
function avatarJustDied() {
    paused = true;
    dead = true;
}

//author:Threejs Particle Explosion
function ExplodeAnimation(x,y,z) {
    const geometry = new THREE.Geometry();

    for (let i = 0; i < totalObjects; i ++)
    {
        const vertex = new THREE.Vector3();
        vertex.x = x;
        vertex.y = y;
        vertex.z = z;

        geometry.vertices.push( vertex );
        dirs.push({
            x:( Math.random() * movementSpeed ) - ( movementSpeed /2 ),
            y:( Math.random() * movementSpeed ) - ( movementSpeed /2 ),
            z:( Math.random() * movementSpeed ) - ( movementSpeed /2 )
        });
    }

    let material = new THREE.PointsMaterial( { size: objectSize,  color: 0x654321 });
    this.object = new THREE.Points(geometry, material);
    this.status = true;

    scene.add( this.object  );

    this.update = function(){
        if (this.status === true){
            let pCount = totalObjects;
            while(pCount--) {

                const particle = this.object.geometry.vertices[pCount];

                particle.y += dirs[pCount].y;
                particle.x += dirs[pCount].x;
                particle.z += dirs[pCount].z;
            }
            this.object.geometry.verticesNeedUpdate = true;
        }
    }

}

function handleDeath(){


    //decrease scale factor, to animate ball extremely shrinking
    ballScaleFactor -= 0.15;

    //what to do immediately after the scaleFactor reaches 0 or less and shrink animation is complete
    if (shrinkAnimationNotComplete && ballScaleFactor <= 0){
        //show particles explosion animation
        shrinkAnimationNotComplete = false;
        parts.push(new ExplodeAnimation(ball.position.x, ball.position.y, ball.position.z));
        let explosionSoundEffect = document.getElementById("ballExplosion");
        explosionSoundEffect.volume = 0.4;
        explosionSoundEffect.play();

        //functions shows game over
        waitForExplosionAnimationToEnd();
    }
    else if (ballScaleFactor <= 0) ballScaleFactor = 0;// maintains the value of ballScaleFactor

    //apply the scale to the ball, to animate it as shrinking
    ball.scale.set(ballScaleFactor, ballScaleFactor, ballScaleFactor);

    //particle animation
    let pCount = parts.length;
    while(pCount--) parts[pCount].update();
}

//function waits 3 seconds then pops up an overlay
function waitForExplosionAnimationToEnd() {
    setTimeout(function () {
        document.getElementById('gameOverOverlay').style.display = 'flex';
    }, 2000);

}

//decreases the life gauge of the ball
function updateBallLife(){
    redPlane.scale.set(lifeScaleFactor, 1, 1);
    lifeScaleFactor -= 0.0025;

    if (lifeScaleFactor <= 0) avatarJustDied();
}
