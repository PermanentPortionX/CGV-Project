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

//this function reads gameBuildList(below the function) and builds a world based on the values of the gameBuildList
function buildGame() {

    lastPos += 6;
    //iterate through each list in gameBuildList and build a game block that represents it
    for (let i = 0; i < gameBuildList.length; i++) {
        let blockSection = gameBuildList[i];

        if (blockSection.length === 1) {
            //notify user of the new level they at
            //configure game behavior
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
                                if (j === 0)  zPos = 2.5;
                                else if (j === 1) zPos = 1.6;
                                else zPos = 0.7;
                            }
                            else {
                                if (j === 3) zPos = -0.7;
                                else if (j === 4) zPos = -1.6;
                                else zPos = -2.5;
                            }

                            blockSmallSpikes.position.x = xPos;
                            blockSmallSpikes.position.z = zPos;
                            blockScene.add(blockSmallSpikes);
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
    [1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1]
];