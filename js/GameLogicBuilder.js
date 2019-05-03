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
    ["Level 1", 0.3, 0.0025],
    ["Level 2", 0.35, 0.003],
    ["Level 3", 0.4, 0.0035],
    ["Level 4", 0.45, 0.004]
];

//lists that keeps track of the beginning of each level
let levelDistanceTracker = [];

//keeps track of the current level
let currLevel = -1;

//list of next collidable objects
let nextCollidableObstacles = [];

let nextObstacle = null;

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
                    switch (blockSet[ blockSection[j] ][k]) {
                        case 1: //spike

                            const blockSmallSpikes = spikes.clone();
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
                                    nz = lastPos - 2.5 + zPos + 1.5;
                                }
                                else if (j === 4) {
                                    zPos = -1.6;
                                    nz = lastPos - 2.5 + zPos + 1.9;
                                }
                                else {
                                    zPos = -2.5;
                                    nz = lastPos - 2.5 + zPos + 1.5;
                                }
                            }

                            blockSmallSpikes.position.x = xPos;
                            blockSmallSpikes.position.z = zPos;

                            blockScene.add(blockSmallSpikes);

                            let collidableOb = blockSmallSpikes.clone();
                            collidableOb.position.z = nz;
                            collidableItems.push(collidableOb);
                            break;

                        case 2: //block

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
    nextObstacle = collidableItems[0];
    for (let i = 0; i < collidableItems.length; i++) {
        if (nextObstacle.position.z === collidableItems[i].position.z) {
            nextCollidableObstacles.push(collidableItems[i]);
        }
        else break;
    }
}
//

function checkForCollisionsBetweenBallAndObstacles() {
    if (nextObstacle.length !== 0 && collidableItems.length !== 0) {
        if (ball.position.z >= nextCollidableObstacles[0].position.z) {
            for (let i = 0; i < nextCollidableObstacles.length; i++) {
                let ob = nextCollidableObstacles[i];
                let boundingBox = new THREE.Box3().setFromObject(ob);
                let obHeight = boundingBox.getSize().y;

                let maxX = Math.max(ob.position.x, ball.position.x);
                let minX = Math.min(ob.position.x, ball.position.x);

                let diffX = Math.abs(maxX - minX);

                let diffZ = Math.abs(ob.position.z) - Math.abs(ball.position.z);
                if (diffZ >= 0 && diffZ <= 1 && diffX >= 0 && diffX <= 0.5 //&& ball.position.y <= 1.5
                ){
                    if (jumping){
                        if (//goingUp &&
                            ball.position.y <= obHeight) paused = true;
                    }
                    else paused = true;

                }
            }
        }else{
            while (ball.position.z <= nextCollidableObstacles[0].position.z) {
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

    //checks if the lev
    if (levelDistanceTracker.length !== 0) {
        let nextLevelZ = Math.abs(levelDistanceTracker[0]);
        if (currBallZ >= nextLevelZ){
            ++currLevel;
            gameSpeed = levelConfig[currLevel][1];
            levelDistanceTracker.shift();
            console.log("new Level" + currLevel.toString());
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

//Obstacles symbols
// 1 -> Spikes
// 2 -> Cube
const gameBuildList = [
    [0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0],
    [0, 0, 1, 0, 0, 0],
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