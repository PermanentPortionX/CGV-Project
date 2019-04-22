let ball = null;
let ballIntersectsWithFloor = null;
let positionJustAboveGround;

function buildBall() {
    const ballTexture = new THREE.TextureLoader().load("textures/ball_textures/ball_t.jpg");
    const geometry = new THREE.SphereGeometry(0.25, 32, 32);
    const material = new THREE.MeshBasicMaterial({map: ballTexture});
    ball = new THREE.Mesh(geometry, material);

    //ball rayCaster
    const ballRayCaster = new THREE.Raycaster();
    ballRayCaster.set(ball.position, new THREE.Vector3(0, 1, 0));
    ballIntersectsWithFloor  = ballRayCaster.intersectObject(ground);
    //positionJustAboveGround  = ballIntersectsWithFloor[0].point.y;

    ball.position.y = ballIntersectsWithFloor[0].point.y + 0.25;

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

