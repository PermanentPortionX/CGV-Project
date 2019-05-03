let jumping = false; //tracks the balls state, true if the ball is in jump state and false if its not
let goingUp = false; //true if ball is going up
let ballPreviousY = 0; //keeps track of the balls previous y to determine if it's going up or down

let velocity = new THREE.Vector3(0, 3 , 0);
let gravity = new THREE.Vector3(0, -2, 0);

let prevTime = 0;
let currTime = performance.now();


const keyState = {};

//this function pauses a game, by pausing music, scene then displays an overlay
function pauseGame(){
    if (dead) return; //doing nothing once the avatar is dead
    paused = true;
    backgroundMusic.pause();
    document.getElementById('pauseMenuOverlay').style.display = 'flex';
}

//resumes game
function resumeGame(){
    paused = false;
    backgroundMusic.play();
    document.getElementById('pauseMenuOverlay').remove();
}

//add listening for key presses, e.g. a, d, w is pressed
//then stores the value into a dictionary
function initKeyboard(){

    window.addEventListener('keydown', function (e) {
        e.preventDefault();
        //pause game pressed
        if (e.key.toLowerCase() === "escape") pauseGame();
        if (e.key.toLowerCase() === "c") FPSView = !FPSView;
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

    //makes the ball jump and plays the jump sound effect
    else if(keyState[' '] || keyState['arrowup'] || keyState['w']) {
        jumpSoundEffect.pause();
        jumpSoundEffect.currentTime = 0;
        jumpSoundEffect.play();
        jumping = true;
    }

    if (jumping){
        let delta = currTime - prevTime;
        if (delta > 0.1) delta = 0.1;

        ballPreviousY = ball.position.y;
        ball.position.y += velocity.y * delta;

        goingUp = ballPreviousY < ball.position.y; //tracks if ball is going up or not while in jump state

        velocity.y += gravity.y * delta;
    }
}

//resets all values back to default after the ball has landed on the ground after jumping
function resetJumpVarsToDefault() {
    velocity = new THREE.Vector3(0, 3, 0);
    gravity = new THREE.Vector3(0, -2, 0);
    jumping = false;
    goingUp = false;
    ballPreviousY = 0;
}