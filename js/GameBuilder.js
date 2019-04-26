

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

function buildGame() {

    lastPos += 6;
    for (let i = 0; i < gameBuildList.length; i++) {
        let blockSection = gameBuildList[i];

        if (blockSection.length === 1) {
            //level indicator
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

                            const blockSmallSpikes = smallSpikes.clone();
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