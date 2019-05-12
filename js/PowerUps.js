let shieldMat = null; //used to update it's reflectivity

//builds the heart power up
const buildHeart = function(){
    //the heart power up is built using a bezierCurve then scaled and positioned in the end to make it fit in the world
    const x = -25, y = -250;
    const heartShape = new THREE.Shape();
    heartShape.moveTo( x + 25, y + 25 );
    heartShape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
    heartShape.bezierCurveTo( x - 30, y, x - 30, y + 35,x - 30,y + 35 );
    heartShape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
    heartShape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
    heartShape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
    heartShape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );

    const extrudeSettings = {
        steps: 2,
        depth: 16,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({color: 0xFF0000});

    const mesh = new THREE.Mesh(geometry, material);

    mesh.material.shading = THREE.SmoothShading;
    mesh.scale.set(0.007, -0.007, 0.007);
    mesh.position.y = -1;
    return mesh;
};

//builds the trap power up
const buildTrap = function(){
    //creates a scene where all the points will be stored
    const scene = new THREE.Scene();
    //keeps track of the number of points generated
    let numOfPoints = 0;

    const dotGeometry = new THREE.Geometry();

    //this function generates 10000 dots of random color, which form a sphere
    while(numOfPoints <= 10000){
        const cx = Math.random();
        const cy = Math.random();
        const cz = Math.random();

        const px = (cx*2) - 1;
        const py = (cy*2) - 1;
        const pz = (cz*2) - 1;

        //the if statement restricts all the points to be within a sphere
        if (Math.pow(px, 2) + Math.pow(py, 2) + Math.pow(pz, 2) <= 1) {
            //if point is within the sphere, the number of points increments
            numOfPoints++;
            dotGeometry.vertices.push(new THREE.Vector3(px, py, pz));
            dotGeometry.colors.push(new THREE.Color(cx, cy, cz));
        }
    }

    const dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false, vertexColors: THREE.VertexColors  } );
    const dot = new THREE.Points( dotGeometry, dotMaterial );
    scene.add( dot );
    scene.scale.set(0.35, 0.35, 0.35);
    scene.position.y = 0.5;
    return scene;
};

//builds the shield that appears in the world
const buildShield = function(){
    //shield is made up of a sphere geometry and lambert material
    const geo = new THREE.SphereGeometry(0.4, 32, 32);
    shieldMat = new THREE.MeshLambertMaterial({color: 0xd4eff4, transparent: true, opacity: 0.5});
    const mesh = new THREE.Mesh(geo, shieldMat);
    mesh.position.y = ballIntersectsWithFloor[0].point.y + 0.4;
    return mesh;
};