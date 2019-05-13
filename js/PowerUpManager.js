//vars check if ball collided with any power up
let ballCollidedWithShield = false;
let ballCollidedWithHeart = false;

//keeps track of how many shields the player has
let actualNumOfShield = 0;

//var keeps track amount of shield the user has left, when activated, it decreases when activated
let shieldScaleFactor = 1;

//function called when the ball collides with a shield
function collidedWithShield(){
    //plays a sound effect at the first time when the ball collides with shield
    if (ballCollidedWithShield === false) playSoundEffect("shieldEffect", 0.6);
    ballCollidedWithShield = true;
}

//function called when the ball collides with a heart
function collidedWithHeart() {
    //plays a sound effect at the first time when the ball collides with ball
    if (ballCollidedWithHeart === false) playSoundEffect("lifeEffect", 1);
    ballCollidedWithHeart = true;
}

//this function is called after collisions have taken place
//it then updates the overlay if any collision with power up
//took place
function listenForPowerUps(){

    if (ballCollidedWithShield) {
        ballCollidedWithShield = false;
        actualNumOfShield++;//increases the actual number of shields the user has and updates in overlay that shows
        //the power ups and score
        document.getElementById("numOfShield").innerHTML = "<img src=\"textures/score_board/the_edge_invincible_icon.png\"" +
            " alt=\"\" width=\"21\" height=\"20\"> Y: " + actualNumOfShield.toString();
    }

    //updates the life scale factor by 20% if the ball collided with heart
    if (ballCollidedWithHeart){
        ballCollidedWithHeart = false;
        //PARENT: HERO_BALL.js
        lifeScaleFactor += 0.2;
        if (lifeScaleFactor >= 1) lifeScaleFactor = 1;
    }
}

//function takes in id and volume for power up audio then plays
function playSoundEffect(id, volume) {
    let soundEffect = document.getElementById(id);
    soundEffect.currentTime = 0;
    soundEffect.volume = volume;
    soundEffect.play();
}

//function called when user activates shield
function shieldActivated(){
    //checks if user has shields and there's no shield activated currently
    if(actualNumOfShield > 0 && !heroShieldActivated){
        //the shieldScaleFactor resets to 1 then decreases as game continues
        shieldScaleFactor = 1;
        //plays a sound effect to alert user that shield is activated
        document.getElementById("shieldActivated").play();
        //decreases the number of shield the user has
        actualNumOfShield--;
        //adds a shield in front of the ball
        scene.add( heroShield );
        //var set to true to allow the ball to pass through obstacles and not die
        heroShieldActivated = true;
        //updates the number of shields in overlay
        document.getElementById("numOfShield").innerHTML = "<img src=\"textures/score_board/the_edge_invincible_icon.png\"" +
            " alt=\"\" width=\"21\" height=\"20\"> Y: " + actualNumOfShield.toString();
    }
}

//function called when the shield runs out
function shieldDeactivated(){
    //plays a sound effect alerting player that shield is deactivated
    document.getElementById("shieldDeactivated").play();
    //var set to false, to prevent ball from passing through obstacles
    heroShieldActivated = false;
    //removes the shield from the scene
    scene.remove(heroShield);
}

//updates the life state of the shield when activated
function updateHeroShieldIfActive(){
    if (heroShieldActivated) {
        //shield decreases each and every frame by 0.0025
        shieldScaleFactor -= 0.0035;
        //updates the life gauge of power up in the state gauge
        powerUpLifePlane.scale.set(shieldScaleFactor, 1, 1);
        //if shield has ran out, deactivate function is called and powerUpLifePlane scale is set to zero
        if (shieldScaleFactor <= 0) {
            shieldDeactivated();
            powerUpLifePlane.scale.set(0, 1, 1);
        }
    }
}

//checks if power up key is pressed or not
function powerUpKeyPressed(key){
    if (key === 'y') {
        shieldActivated();
        return true;
    }
    return false;
}