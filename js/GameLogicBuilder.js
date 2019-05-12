/***********************  GAME LOGIC BUILDER **********************************/
/*                                                                            */
/*                             WHERE                                          */
/*                                  THE                                       */
/*                              TRUE                                          */
/*                                  MAGIC                                     */
/*                             TAKES                                          */
/*                                  PLACE                                     */
/*                                                                            */
/*                                                                            */
/***********************  GAME LOGIC BUILDER **********************************/
//list of items that can collide with hero
const collidableItems = [];

//var holds the gameSpeed, increases as levels increase
let gameSpeed = 0.3;

//lists that describes the configurations of each level
//first is the string that states which level the avatar is at
//second describes the ball speed at each level
//third describes the rate of life decrease
const levelConfig = [
    ["Level 1", 0.32, 0.0025],
    ["Level 2", 0.39, 0.003],
    ["Level 3", 0.47, 0.0035],
    ["Level 4", 0.56, 0.004]
];

//lists that keeps track of the beginning of each level
let levelDistanceTracker = [];

//keeps track of the current level
let currLevel = -1;

//list of next collidable objects
let nextCollidableObstacles = [];

//keeps track of the last scene built
let sceneTracker = 0;

let defaultBlockScene = null;

//this function reads gameBuildList(below the function) and builds a world based on the values of the gameBuildList
function buildGame() {

    //checks if the default scene has already been built, if not the defaultBlockScene gets built
    if (defaultBlockScene === null) buildDefaultBlockScene();

    lastPos += 6;
    //tracks how many scenes where built
    let builtSceneIntervalTracker = 0;

    //iterate through each list in gameBuildList and build a game block that represents it
    for (let i = sceneTracker; i < gameBuildList.length; i++) {

        if (builtSceneIntervalTracker === 8) {
            sceneTracker = i;
            break;
        }

        let blockSection = gameBuildList[i]; //retrieves an item from gameBuildList which describes a blockSection in the world

        //when the length is 1, it's a level indicator
        //instead of building a blockSection, the words that state new level has been reached are displayed
        if (blockSection.length === 1) {
            const cubeMat = new THREE.MeshLambertMaterial({color: 0xff3300});
            //the blockSection will have a value that points to a position in level config list
            //below method gets the string from level config, then builds a textGeometry
            const textGeo = new THREE.TextGeometry( levelConfig[ blockSection[0] ][0], {
                font: font,
                size: 1,
                height: 0.5,
                curveSegments: 12,
                weight: "normal",
                bevelThickness: 0.1,
                bevelSize: 0.3,
                bevelSegments: 0.1,
                bevelEnabled: false
            });
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            //builds text mesh object
            //the text mesh display which level the user is currently at
            const text = new THREE.Mesh(textGeo, cubeMat);
            text.castShadow = true;
            text.position.y = 4;
            text.position.x = -2;
            text.position.z = lastPos - 36;
            text.scale.set(1, 1, 0.5);

            //adds the text to the scene
            scene.add(text);

            //levelDistanceTracker keeps track of the z position of where each level starts
            //this is used to know when the ball reaches a new level nd configure the scene and avatar
            //according to level config
            levelDistanceTracker.push(lastPos - 36);
        }

        else{
            //create a scene that will hold the section of the world
            //clones the defaultBlockScene
            const blockScene = defaultBlockScene.clone();

            //blockScene z position is set to the last position it has to be added
            blockScene.position.z = lastPos;

            //add the obstacles and power ups
            //first loop iterates through blockSection that contains lists that contain indexes of
            //possible obstacle and power up combinations stored in obstacleSet
            //j also indicates the z value of obstacle combination
            for(let j = 0; j < blockSection.length; j++){

                //get the power up and block section pair
                let powerUpLevelDescPair = blockSection[j];

                //each list at position j, contains positions for a combination in BlockSet
                //combinations have 5 values which indicate different positions of the x value of each power up or obstacle
                for(let k = 0; k < 5; k++){

                    let xPos = 0; // x position of each obstacle or power up within the blockScene coordinate system
                    let zPos = 0; // z position of each obstacle or power up within the blockScene coordinate system
                    let nz = 0; // x position of each obstacle or power up within the game scene coordinate system(needs to be calculated for collisions)

                    //calculate the position of x for the blockScene coordinate system
                    if (k < 2) xPos = k === 0 ? 1.8 : k - 0.1;
                    else if(k === 2) zPos = xPos = 0;
                    else xPos = k === 4 ? -1.8 : -0.9;


                    //calculate the z position of obstacle in two coordinate system
                    //blockScene coordinate system (zPos), game scene coordinate system(nz)
                    if (j <= 2) {
                        if (j === 0)  nz = lastPos - (zPos = 2.5) + 4.1;
                        else if (j === 1) nz = lastPos - (zPos = 1.6) + 2.3;
                        else nz = lastPos - (zPos = 0.7) + 0.5;

                    }
                    else {
                        if (j === 3) nz = lastPos + (zPos = -0.7) - 0.5;
                        else if (j === 4) nz = lastPos + (zPos = -1.6) -0.5;
                        else nz = lastPos + (zPos = -2.5) - 0.5;
                    }

                    /**********************POWER UPS DECLARATION******************************************/
                    //powerUpLevelDescPair[0] gets the position of combination list from PowerUpSet
                    //obstacleSet[ powerUpLevelDescPair[0] ][k] gets the power up type
                    if (powerUpLevelDescPair[0] !== -1){
                        switch (powerUpSet[ powerUpLevelDescPair[0] ][k]) {
                            case 90: //heart
                                //adds power up to the scene
                                addObstacleOrPowerUp(xPos, -1, zPos, nz, heart.clone(), blockScene, 90);
                                break;

                            case 93: //shield
                                addObstacleOrPowerUp(xPos, -1, zPos, nz, shield.clone(), blockScene, 93);
                                break;

                            case 94: //trap
                                //same approach as heart
                                addObstacleOrPowerUp(xPos, -1, zPos, nz, trap.clone(), blockScene, 94);
                                break;

                            case 95: //floating heart
                                //same approach as heart
                                addObstacleOrPowerUp(xPos, 1, zPos, nz, heart.clone(), blockScene, 95);
                                break;

                            case 98: //floating invincible
                                addObstacleOrPowerUp(xPos, 2.3, zPos, nz, shield.clone(), blockScene, 98);
                                break;

                            case 99: //floating trap
                                //same approach as heart
                                addObstacleOrPowerUp(xPos, 2.3, zPos, nz, trap.clone(), blockScene, 99);
                                break;
                        }
                    }


                    /**********************OBSTACLES DECLARATION******************************************/
                    //powerUpLevelDescPair[1] gets the position of combination list from BlockSet
                    //obstacleSet[ powerUpLevelDescPair[1] ][k] gets the obstacle type
                    switch (obstacleSet[ powerUpLevelDescPair[1] ][k]) {//obstacle type
                        case 1: //spike
                            addObstacleOrPowerUp(xPos, -1, zPos, nz, spikes.clone(), blockScene, 1);
                            break;

                        case 2: //block
                            //same approach as spikes above
                            addObstacleOrPowerUp(xPos, -1, zPos, nz, cube.clone(), blockScene, 2);
                            break;

                        case 3: //floating cubes
                            //same approach as spikes above, difference is the y part
                            addObstacleOrPowerUp(xPos, 2.5, zPos, nz, cube.clone(), blockScene, 3);
                            break;
                    }


                }
            }

            //then gets added into the real world
            scene.add(blockScene);

            //decrement lastPos to add the next obstacle at the last position
            lastPos -= 6;
        }

        builtSceneIntervalTracker++;
    }

    //to save computation, we only have to check if the ball is colliding with the nearest obstacles only, these are always
    //located at the top of the list
    buildNextCollidableObstacles();
}

function addObstacleOrPowerUp(xPos, yPos, zPos, nz, obstacleOrPowerUp, blockScene, obstacleOrPowerUpType) {
    //set the positions of x and z according to the positions that were calculated previously
    obstacleOrPowerUp.position.x = xPos;
    obstacleOrPowerUp.position.z = zPos;

    if (yPos !== -1) obstacleOrPowerUp.position.y = yPos;

    //after setting position, obstacle or power up is added on to blockScene which is later added into the
    //world(scene)
    blockScene.add(obstacleOrPowerUp);

    //create a copy of the obstacle or power up to test for collisions
    let collidableObstacleOrPowerUp = obstacleOrPowerUp.clone();
    //set the z position to the position it was suppose to be at in the real world
    collidableObstacleOrPowerUp.position.z = nz;
    //the collidable object needs to be saved as a tuple, major aim is to store the collidable obj
    //together with its obstacle or power up type, obstacle or power up type is later used when checking for collisions, since
    //different obstacles or power ups collide with ball differently
    //Tuple is added into a list that stores all the collidable items
    collidableItems.push([obstacleOrPowerUpType, collidableObstacleOrPowerUp]);
}

//function builds a list of collidable objects
//the function takes the first collidableItem from the collidableItemsList
//builds a list of obstacles in the same z position, if not, then stop
function buildNextCollidableObstacles(){
    for (let i = 0; i < collidableItems.length; i++) {
        if (collidableItems[0][1].position.z === collidableItems[i][1].position.z) nextCollidableObstacles.push(collidableItems[i]);
        else break;
    }
}

//builds the default scene
//the default scene can just be cloned going forward
function buildDefaultBlockScene(){
    defaultBlockScene = new THREE.Object3D();
    defaultBlockScene.add(ground.clone());
    defaultBlockScene.add(rightSide.clone());
    defaultBlockScene.add(leftSide.clone());
    defaultBlockScene.add(rightTree.clone());
    defaultBlockScene.add(leftTree.clone());
    defaultBlockScene.receiveShadow = true;
}

//checks for collisions between the ball and obstacles
function checkForCollisionsBetweenBallAndObstacles() {
    if (collidableItems.length !== 0) {//checks if there are any collidable objects left

        if (ball.position.z >= nextCollidableObstacles[0][1].position.z) {//checks if ball has arrived at the nearest obstacle and has not passed the obstacle yet
            //nextCollidableObstacles only contains obstacles in the same z position and ball hasn't reached their z position, made possible by buildNextCollidableObstacles()
            for (let i = 0; i < nextCollidableObstacles.length; i++) {
                let nextCollidableItem = nextCollidableObstacles[i];

                //calculate all the positions of the ball with respect to the nearest collidable obstacle
                let ob = nextCollidableItem[1];
                let boundingBox = new THREE.Box3().setFromObject(ob);
                let obHeight = boundingBox.getSize().y;

                //calculates how far the ball is from the collidable object, in terms of width
                let maxX = Math.max(ob.position.x, ball.position.x);
                let minX = Math.min(ob.position.x, ball.position.x);
                let diffX = Math.abs(maxX - minX);

                //calculate how far the ball is from the collidable object, in terms of depth
                let diffZ = Math.abs(ob.position.z) - Math.abs(ball.position.z);

                //checks if the ball is falling onto obstacle or colliding with obstacle
                let fallingOntoOrCollidingWithObstacle = ((jumping && ball.position.y <= obHeight) || !jumping);

                //checks if ball is colliding with obstacle in x position
                let collidingInX = diffX >= 0 && diffX <= 0.4;

                //decisions about the balls life state is made from the difference in the x's, difference in the z's
                switch (nextCollidableItem[0]) { //collidable type
                    case 1: //spikes
                        if (diffZ >= 0 && diffZ <= 0.8 && collidingInX && fallingOntoOrCollidingWithObstacle)
                            avatarJustDied(); //function found in HeroBall
                        break;

                    case 2: //cubes
                        if (diffZ >= 0 && diffZ <= 1 && collidingInX && fallingOntoOrCollidingWithObstacle)
                            avatarJustDied(); //function found in HeroBall
                        break;

                    case 3: //floating cube
                        if (diffZ >= 0 && diffZ <= 1 && collidingInX && jumping && ball.position.y >= 1)
                            avatarJustDied(); //function found in HeroBall
                        break;

                    case 90: //heart
                        if (diffZ >= 0 && diffZ <= 1 && collidingInX && fallingOntoOrCollidingWithObstacle)
                            collidedWithHeart(); //function found in PowerUpManager
                        break;

                    case 93: //shield
                        if (diffZ >= 0 && diffZ <= 1 && collidingInX && fallingOntoOrCollidingWithObstacle)
                            collidedWithShield(); //function found in PowerUpManager
                        break;

                    case 94: //trap
                        if (diffZ >= 0 && diffZ <= 1 && collidingInX && fallingOntoOrCollidingWithObstacle)
                            avatarJustDied(); //function found in HeroBall
                        break;

                    case 95://floating heart
                        if (diffZ >= 0 && diffZ <= 1 && collidingInX && jumping && ball.position.y >= 1)
                            collidedWithHeart(); //function found in PowerUpManager
                        break;

                    case 98://floating shield
                        if (diffZ >= 0 && diffZ <= 1 && collidingInX && jumping && ball.position.y >= 1.8)
                            collidedWithShield(); //function found in PowerUpManager
                        break;

                    case 99://floating trap
                        if (diffZ >= 0 && diffZ <= 1 && collidingInX && jumping && ball.position.y >= 1.5)
                            avatarJustDied(); //function found in HeroBall
                        break;


                }
            }
        }else{
            //check if any collisions with power ups happened
            listenForPowerUps();

            //ball has passed the collidable obstacle
            //all obstacles that have been passed by the ball should be removed from the nextCollidableObstacles and collidableItems list
            //because they no longer have use
            while (ball.position.z <= nextCollidableObstacles[0][1].position.z) {
                nextCollidableObstacles.shift();
                if (collidableItems.length !== 0) {
                    if (ball.position.z <= collidableItems[0][1].position.z) collidableItems.shift();
                }
                if (nextCollidableObstacles.length === 0) break;
            }
            //build the next set of collidable objects if available
            if (collidableItems.length !== 0) buildNextCollidableObstacles();
        }

    }
}

//this function checks which level you at, then updates the level configs
function updateLevelIfHeroIsInNewLevel(){

    //get the current z position of the ball
    let currBallZ = Math.abs(ball.position.z);

    //checks if there are any more levels
    if (levelDistanceTracker.length !== 0) {
        //the next z position of the next level is always on the top of the list
        let nextLevelZ = Math.abs(levelDistanceTracker[0]);
        //when ball reaches a new level, the currBallZ will be greater
        //or equal to the top z position in levelDistanceTracker
        if (currBallZ >= nextLevelZ){
            //play sound to indicate new level
            let newLevelSoundEffect = document.getElementById("newLevel");
            newLevelSoundEffect.volume = 0.6;
            newLevelSoundEffect.play();

            //increment the currLevel
            ++currLevel;

            //set the text to display current level
            document.getElementById("currLevelDisplay").innerHTML = levelConfig[currLevel][0];

            //update game speed according
            gameSpeed = levelConfig[currLevel][1];
            //update life decrease rate of ball
            lifeDecreaseRate = levelConfig[currLevel][2];
            //since we in the new level, the top z value has to be removed
            levelDistanceTracker.shift();
        }
    }

}

//this list contains specifications of every level
//the first list [0] is an indicator of which level the game is at
//the list with 6 values (pair of two values), represents 1 block of the scene
//the pair of two values hold positions of power ups set in PowerUpSet and and BlockSet respectively
//a block has width 5 and height 6, each value in the list represents
//a row of the block, for simplicity look at the block as a 6 x 5 matrix
// 0 0 0 0 0
// 0 0 0 0 0
// 0 0 0 0 0
// 0 0 0 0 0
// 0 0 0 0 0
// 0 0 0 0 0
//from gameBuildList, each list has 6 values which describe how the row must be rendered
//e.g. add obstacles, add power ups
//the children(inner list) of gameBuildList contains values that index another list called
//block set //-- PARENT: BLOCKSET.js --//, this list is the one that has possible combinations of
//obstacles that can be added onto a scene, for simplicity look at this whole thing in terms of
//INDEXED FACE SETS
//game build list contains indexes of block set
const gameBuildList = [
    [0],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [1],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [2],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [3],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
];