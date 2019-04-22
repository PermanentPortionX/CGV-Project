let jumping = false;
const keyState = {};

let velocity = new THREE.Vector3(0, 3 , 0);
let gravity = new THREE.Vector3(0, -2, 0);
let prevTime = 0;
let currTime = performance.now();

function initKeyboard(){

    window.addEventListener('keydown', function (e) {
        e.preventDefault();
        keyState[e.key] = true;
    }, true);

    window.addEventListener('keyup', function (e) {
        e.preventDefault();
        keyState[e.key] = false;
    }, true);

}

function updateBallPositionAccordingToKeyPress(){
    prevTime = currTime;
    currTime = performance.now();


    if (keyState['a'] || keyState["ArrowLeft"]) {
        ball.position.x -= 0.1;
        if (ball.position.x <= -1.8){
            ball.position.x = -1.8;
        }
        document.getElementById("pt").innerHTML = ball.position.x;
    }

    else if (keyState['d'] || keyState["ArrowRight"]){
        ball.position.x += 0.1;
        if (ball.position.x >= 1.8){
            ball.position.x = 1.8;
        }
        document.getElementById("pt").innerHTML = ball.position.x;
    }

    else if (keyState["Escape"]) {
        //paused = !paused;
        if (!paused) {
            cancelAnimationFrame(GameLoop);
            paused = true;
            //GameLoop();
        }
    }
    else if (keyState["Enter"]) {
        if (paused){
            paused = false;
            requestAnimationFrame(GameLoop)
        }
    }
    else if(keyState[' ']) jumping = true;


    if (jumping){

        let delta = currTime - prevTime;
        if (delta > 0.1) delta = 0.1;

        ball.position.y += velocity.y * delta;
        velocity.y += gravity.y * delta;

    }
}

function resetJumpVarsToDefault() {
    jumping = false;
    velocity = new THREE.Vector3(0, 3, 0);
    gravity = new THREE.Vector3(0, -2, 0);
}