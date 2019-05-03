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
            const blockScene = new THREE.Scene( );
            //add defaults
            blockScene.add(ground.clone());
            blockScene.add(rightSide.clone());
            blockScene.add(leftSide.clone());
            blockScene.add(rightTree.clone());
            blockScene.add(leftTree.clone());

            for(let j = 0; j < blockSection.length; j++){

                for(let k = 0; k < 5; k++){
                    let xPos = 0;
                    let zPos = 0;
                    let nz = 0;

                    //calculate the position of x
                    if (k < 2) {
                        if (k === 0) xPos = 1.8;
                        else xPos = k - 0.1;
                    }
                    else if(k === 2) zPos = xPos = 0;

                    else{
                        if (k === 4) xPos = -1.8;
                        else xPos = -0.9;
                    }

                    //calculate the position of z
                    if (j <= 2) {
                        if (j === 0){
                            zPos = 2.5;
                            nz = lastPos - zPos + 4.1;
                        }
                        else if (j === 1) {
                            zPos = 1.6;
                            nz = lastPos - zPos + 2.3;
                        }
                        else {
                            zPos = 0.7;
                            nz = lastPos - zPos + 0.5;
                        }
                    }
                    else {
                        if (j === 3) {
                            zPos = -0.7;
                            nz = lastPos + zPos - 0.5;
                        }
                        else if (j === 4) {
                            zPos = -1.6;
                            nz = lastPos + zPos -0.5;
                        }
                        else {
                            zPos = -2.5;
                            nz = lastPos + zPos - 0.5;
                        }
                    }

                    switch (blockSet[ blockSection[j] ][k]) {
                        case 1: //spike

                            const blockSmallSpikes = spikes.clone();


                            blockSmallSpikes.position.x = xPos;
                            blockSmallSpikes.position.z = zPos;
                            blockScene.add(blockSmallSpikes);

                            let collidableSpike = blockSmallSpikes.clone();
                            collidableSpike.position.z = nz;
                            let collidableSpikePair = [1, collidableSpike];
                            collidableItems.push(collidableSpikePair);
                            break;

                        case 2: //block

                            const blockCubes = cube.clone();
                            blockCubes.position.x = xPos;
                            blockCubes.position.z = zPos;
                            blockScene.add(blockCubes);

                            let collidableCube = blockCubes.clone();
                            collidableCube.position.z = nz;
                            let collidableCubePair = [2, collidableCube];
                            collidableItems.push(collidableCubePair);
                            break;

                        case 3: //floating cubes
                            const floatingCubes = cube.clone();
                            floatingCubes.position.x = xPos;
                            floatingCubes.position.z = zPos;
                            floatingCubes.position.y = 2.5;
                            blockScene.add(floatingCubes);

                            let collidableFloatingCube = floatingCubes.clone();
                            collidableFloatingCube.position.z = nz;
                            let collidableFloatingCubePair = [3, collidableFloatingCube];
                            collidableItems.push(collidableFloatingCubePair);
                            break;
                    }
                }
            }

            blockScene.position.z = lastPos;
            scene.add(blockScene);


            lastPos -= 6;
        }
    }

    buildNextCollidableObstacles();
}

//function builds a list of collidable objects
//the function takes the first collidableItem from the collidableItemsList
//builds a list of obstacles in the same z position
function buildNextCollidableObstacles(){
    //nextObstacle = collidableItems[0][1];
    for (let i = 0; i < collidableItems.length; i++) {
        if (collidableItems[0][1].position.z === collidableItems[i][1].position.z) nextCollidableObstacles.push(collidableItems[i]);
        else break;
    }
}

function detectCollision(nextCollidableItem) {

}
//checks for collisions between the ball and obstacles
function checkForCollisionsBetweenBallAndObstacles() {
    if (collidableItems.length !== 0) {
        if (ball.position.z >= nextCollidableObstacles[0][1].position.z) {
            for (let i = 0; i < nextCollidableObstacles.length; i++) {
                let nextCollidableItem = nextCollidableObstacles[i];

                //calculate all the positions
                let ob = nextCollidableItem[1];
                let boundingBox = new THREE.Box3().setFromObject(ob);
                let obHeight = boundingBox.getSize().y;

                let maxX = Math.max(ob.position.x, ball.position.x);
                let minX = Math.min(ob.position.x, ball.position.x);

                let diffX = Math.abs(maxX - minX);

                let diffZ = Math.abs(ob.position.z) - Math.abs(ball.position.z);



                switch (nextCollidableItem[0]) { //collidable type
                    case 1: //spikes
                        if (diffZ >= 0 && diffZ <= 0.8 && diffX >= 0 && diffX <= 0.4 && ((jumping && ball.position.y <= obHeight && !goingUp) || !jumping))
                            died(); //function found in HeroBall
                        break;

                    case 2: //cubes
                        if (diffZ >= 0 && diffZ <= 1 && diffX >= 0 && diffX <= 0.4 && ((jumping && ball.position.y <= obHeight && !goingUp) || !jumping))
                            died(); //function found in HeroBall
                        break;

                    case 3:
                        if (diffZ >= 0 && diffZ <= 1 && diffX >= 0 && diffX <= 0.4 && jumping && ball.position.y >= 1 && goingUp)
                            died(); //function found in HeroBall
                        break;
                }


            }
        }else{
            while (ball.position.z <= nextCollidableObstacles[0][1].position.z) {
                nextCollidableObstacles.shift();
                collidableItems.shift();
                if (nextCollidableObstacles.length === 0) break;
            }
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
            //increment the currLevel
            ++currLevel;
            //update game speed according
            gameSpeed = levelConfig[currLevel][1];
            //since we in the new level, the top z value has to be removed
            levelDistanceTracker.shift();
        }
    }

}

//this list contains specifications of every level
//the first list [1] is an indicator of which level the game is at
//the list with 6 values, represents 1 block of the scene
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
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 31],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0],
    [0, 2, 3, 4, 0, 0],
    [2, 0, 2, 0, 0, 0],
    [0, 1, 0, 2, 0, 1],
    [0, 0, 0, 0, 6, 0],
    [5, 2, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 9, 0, 0, 0],
    [2, 0, 1, 0, 4, 0],
    [0, 0, 0, 0, 4, 0],
    [0, 0, 1, 5, 0, 0],
    [0, 2, 0, 3, 0, 0],
    [0, 0, 0, 0, 4, 0],
    [1, 0, 0, 7, 7, 0],
    [0, 2, 0, 0, 0, 8],
    [0, 0, 3, 0, 9, 0],
    [7, 0, 0, 4, 0, 0],
    [2, 0, 0, 0, 5, 0],
    [0, 0, 4, 0, 0, 6],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 5, 0, 5, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [2],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 5, 0, 5, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [3],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 5, 0, 5, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
];