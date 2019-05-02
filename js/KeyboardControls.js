let jumping = false;+6
const keyState = {};

let velocity = new THREE.Vector3(0, 3 , 0);
let gravity = new THREE.Vector3(0, -2, 0);
let prevTime = 0;
let currTime = performance.now();

//this function pauses a game, by pausing music, scene then displaying an overlay
function pauseGame(){
    paused = true;
    backgroundMusic.pause();
    document.getElementById('pauseMenuOverlay').style.display = 'flex';
}

//resumes game
function resumeGame(){
    paused = false;
    backgroundMusic.play();
    document.getElementById('pauseMenuOverlay').style.display = 'none';
}

//add listening for key presses, e.g. a, d, w is pressed
//then stores the value into a dictionary
function initKeyboard(){

    window.addEventListener('keydown', function (e) {
        e.preventDefault();
        //pause game pressed
        if (e.key.toLowerCase() === "escape") pauseGame();

        else keyState[e.key.toLowerCase()] = true;
    }, true);

    window.addEventListener('keyup', function (e) {
        e.preventDefault();
        keyState[e.key.toLowerCase()] = false;
    }, true);

}

//updates balls position according to key press
function updateBallPositionAccordingToKeyPress(){
    prevTime = currTime;
    currTime = performance.now();

    //moves ball to the left
    if (keyState['a'] || keyState["arrowleft"]) {
        ball.position.x -= 0.1;
        //restricts ball from going beyond -1.8
        if (ball.position.x <= -1.8) ball.position.x = -1.8;
    }

    //moves ball to the right
    else if (keyState['d'] || keyState["arrowright"]){
        ball.position.x += 0.1;
        if (ball.position.x >= 1.8) ball.position.x = 1.8;
    }

    //makes the ball jump
    else if(keyState[' '] || keyState['arrowup'] || keyState['w']) {
        jumpSoundEffect.pause();
        jumpSoundEffect.currentTime = 0;
        jumpSoundEffect.play();
        jumping = true;
    }

    if (jumping){
        let delta = currTime - prevTime;
        if (delta > 0.1) delta = 0.1;

        ball.position.y += velocity.y * delta;
        velocity.y += gravity.y * delta;
    }
}

//resets all values back to default after the ball has landed on the ground after jumping
function resetJumpVarsToDefault() {
    jumping = false;
    velocity = new THREE.Vector3(0, 3, 0);
    gravity = new THREE.Vector3(0, -2, 0);
}