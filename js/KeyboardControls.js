let jumping = false; //tracks the balls state, true if the ball is in jump state and false if its not
let ballPreviousY = 0; //keeps track of the balls previous y to determine if it's going up or down

//var for jumping
let velocity = new THREE.Vector3(0, 3 , 0);
let gravity = new THREE.Vector3(0, -2, 0);
let prevTime = 0;
let currTime = performance.now();

//array keeps track of which key is pressed
const keyState = {};

//this function pauses a game, by pausing music, scene then displays an overlay
function pauseGame(){
    if (dead) return; //doing nothing once the avatar is dead
    paused = true;
    backgroundMusic.pause();
    document.getElementById('scoreBoardOverlay').style.display = "none";
    document.getElementById('pauseMenuOverlay').style.display = 'flex';
}

//resumes game
function resumeGame(){
    paused = false;
    backgroundMusic.play();
    document.getElementById('pauseMenuOverlay').style.display = 'none';
    document.getElementById('scoreBoardOverlay').style.display = "block";
}

//add listening for key presses, e.g. a, d, w is pressed
//then stores the value into a dictionary
function initKeyboard(){

    //function called after user presses a key
    window.addEventListener('keydown', function (e) {
        e.preventDefault();//prevents the web page from scrolling if arrows are pressed
        if (powerUpKeyPressed(e.key.toLowerCase())) return; //check if a power up key is pressed
        if (e.key.toLowerCase() === "p") pauseGame(); //pause game pressed
        else if (e.key.toLowerCase() === "c") FPSView = !FPSView; //changes the camera view
        else keyState[e.key.toLowerCase()] = true; //saves which key was pressed by binding the key pressed to true
    }, true);

    //function called after user lifts hand from key
    window.addEventListener('keyup', function (e) {
        e.preventDefault();//prevents the web page from scrolling if arrows are pressed
        keyState[e.key.toLowerCase()] = false; //binds key that was pressed to false
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
        //restricts ball from going beyond 1.8
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
        velocity.y += gravity.y * delta;
    }
}

//resets all values back to default after the ball has landed on the ground after jumping
function resetJumpVarsToDefault() {
    velocity = new THREE.Vector3(0, 3, 0);
    gravity = new THREE.Vector3(0, -2, 0);
    jumping = false;
    ballPreviousY = 0;
}