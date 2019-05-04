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

//this function reads gameBuildList(below the function) and builds a world based on the values of the gameBuildList
function buildGame() {

    lastPos += 6;
    //iterate through each list in gameBuildList and build a game block that represents it
    for (let i = 0; i < gameBuildList.length; i++) {

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
            const blockScene = new THREE.Scene( );
            //add defaults
            blockScene.add(ground.clone());
            blockScene.add(rightSide.clone());
            blockScene.add(leftSide.clone());
            blockScene.add(rightTree.clone());
            blockScene.add(leftTree.clone());

            //add the obstacles and power ups
            //first loop iterates through blockSection that contains lists that contain indexes of
            //possible obstacle and power up combinations stored in blockSet
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
                    //blockSet[ powerUpLevelDescPair[0] ][k] gets the power up type
                    if (powerUpLevelDescPair[0] !== -1){
                        switch (powerUpSet[ powerUpLevelDescPair[0] ][k]) {
                            case 90: //heart

                                //clone the original heart built in game world to save computation
                                const powerUpHeart = heart.clone();

                                //set the positions of x and z according to the positions that were calculated previously
                                powerUpHeart.position.x = xPos;
                                powerUpHeart.position.z = zPos;

                                //after setting position, heart power up is added on to blockScene which is later added into the
                                //world(scene)
                                blockScene.add(powerUpHeart);

                                //create a copy of the power up to test for collisions
                                let collidableHeart = powerUpHeart.clone();
                                //set the z position to the position it was suppose to be at in the real world
                                collidableHeart.position.z = nz;
                                //the collidable object needs to be saved as a tuple, major aim is to store the collidable obj
                                //together with its power up type, power up type is later used when checking for collisions, since
                                //different power ups collide with ball differently
                                //Tuple is added into a list that stores all the collidable items
                                collidableItems.push([90, collidableHeart]);
                                break;

                            case 91: //bomb
                                //same approach as heart
                                const powerUpBomb = bomb.clone();
                                powerUpBomb.position.x = xPos;
                                powerUpBomb.position.z = zPos;
                                blockScene.add(powerUpBomb);
                                let collidableBomb = powerUpBomb.clone();
                                collidableBomb.position.z = nz;
                                collidableItems.push([91, collidableBomb]);
                                break;

                            case 92: //gun
                                const powerUpGun = gun.clone();
                                powerUpGun.position.x = xPos;
                                powerUpGun.position.z = zPos;
                                blockScene.add(powerUpGun);
                                let collidableGun = powerUpGun.clone();
                                collidableGun.position.z = nz;
                                collidableItems.push([92, collidableGun]);
                                break;

                            case 93: //invincibility

                                break;

                            case 94: //trap
                                const powerUpTrap = trap.clone();
                                powerUpTrap.position.x = xPos;
                                powerUpTrap.position.z = zPos;
                                blockScene.add(powerUpTrap);
                                let collidableTrap = powerUpTrap.clone();
                                collidableTrap.position.z = nz;
                                collidableItems.push([92, collidableTrap]);
                                break;
                        }
                    }


                    /**********************OBSTACLES DECLARATION******************************************/
                    //powerUpLevelDescPair[1] gets the position of combination list from BlockSet
                    //blockSet[ powerUpLevelDescPair[1] ][k] gets the obstacle type
                    switch (blockSet[ powerUpLevelDescPair[1] ][k]) {//obstacle type
                        case 1: //spike

                            //clones the original spike built in game world to save computation
                            const blockSmallSpikes = spikes.clone();

                            //set the positions of x and z according to the positions that were calculated previously
                            blockSmallSpikes.position.x = xPos;
                            blockSmallSpikes.position.z = zPos;
                            //after setting position, spikes are added on to blockScene which is later added into the
                            //world(scene)
                            blockScene.add(blockSmallSpikes);

                            //create a copy of the obstacle to test for collisions
                            let collidableSpike = blockSmallSpikes.clone();
                            //set the z position to the position it was suppose to be at in the real world
                            collidableSpike.position.z = nz;
                            //the collidable object needs to be saved as a tuple, major aim is to store the collidable obj
                            //together with its obstacle type, obstacle type is later used when checking for collisions, since
                            //different power ups and obstacles collide with ball differently
                            //Tuple is added into a list that stores all the collidable items
                            collidableItems.push([1, collidableSpike]);
                            break;

                        case 2: //block

                            //same approach as spikes above
                            const blockCubes = cube.clone();
                            blockCubes.position.x = xPos;
                            blockCubes.position.z = zPos;
                            blockScene.add(blockCubes);
                            let collidableCube = blockCubes.clone();
                            collidableCube.position.z = nz;
                            collidableItems.push([2, collidableCube]);
                            break;

                        case 3: //floating cubes

                            //same approach as spikes above, difference is the y part
                            //since floating cubes have to be floating
                            const floatingCubes = cube.clone();
                            floatingCubes.position.x = xPos;
                            floatingCubes.position.z = zPos;
                            floatingCubes.position.y = 2.5;
                            blockScene.add(floatingCubes);
                            let collidableFloatingCube = floatingCubes.clone();
                            collidableFloatingCube.position.z = nz;
                            collidableItems.push([3, collidableFloatingCube]);
                            break;
                    }


                }
            }

            //blockScene z position is set to the last position it has to be added
            blockScene.position.z = lastPos;
            //then gets added into the real world
            scene.add(blockScene);

            //decrement lastPos to add the next obstacle at the last position
            lastPos -= 6;
        }
    }

    //to save computation, we only have to check if the ball is colliding with the nearest obstacles only, these are always
    //located at the top of the list
    buildNextCollidableObstacles();
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

                //decisions about the balls life state is made from the difference in the x's, difference in the z's
                switch (nextCollidableItem[0]) { //collidable type
                    case 1: //spikes
                        if (diffZ >= 0 && diffZ <= 0.8 && diffX >= 0 && diffX <= 0.4 && ((jumping && ball.position.y <= obHeight && !goingUp) || !jumping))
                            avatarJustDied(); //function found in HeroBall
                        break;

                    case 2: //cubes
                        if (diffZ >= 0 && diffZ <= 1 && diffX >= 0 && diffX <= 0.4 && ((jumping && ball.position.y <= obHeight && !goingUp) || !jumping))
                            avatarJustDied(); //function found in HeroBall
                        break;

                    case 3:
                        if (diffZ >= 0 && diffZ <= 1 && diffX >= 0 && diffX <= 0.4 && jumping && ball.position.y >= 1 && goingUp)
                            avatarJustDied(); //function found in HeroBall
                        break;
                }


            }
        }else{//ball has passed the collidable obstacle
            //all obstacles that have been passed by the ball should be removed from the nextCollidableObstacles and collidableItems list
            //because they no longer have use
            while (ball.position.z <= nextCollidableObstacles[0][1].position.z) {
                nextCollidableObstacles.shift();
                collidableItems.shift();
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
            let explosionSoundEffect = document.getElementById("newLevel");
            explosionSoundEffect.volume = 0.6;
            explosionSoundEffect.play();

            //increment the currLevel
            ++currLevel;
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