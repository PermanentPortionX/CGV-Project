const bomb = function(){
    const scene = new THREE.Scene();

    const bombTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5,0.5, 0.25, 32),
        new THREE.MeshLambertMaterial({color: 0x393636})
    );
    bombTop.position.y=1;

    const bombBody = new THREE.Mesh(
        new THREE.SphereGeometry( 1, 32, 32 ),
        new THREE.MeshPhongMaterial( {color: 0x000000, wireframe: false}));

    function CustomSinCurve( scale ) {

        THREE.Curve.call( this );

        this.scale = ( scale === undefined ) ? 1 : scale;

    }

    CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
    CustomSinCurve.prototype.constructor = CustomSinCurve;

    CustomSinCurve.prototype.getPoint = function ( t ) {

        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;

        return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

    };

    const path = new CustomSinCurve(10);
    const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false);
    const material = new THREE.MeshBasicMaterial({color: 0xA9A9A9});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.03, 0.03, 0.03);
    mesh.position.y = 1.3;
    mesh.position.x = 0.5;
    mesh.rotation.z = 0.4;


    scene.add(bombBody);
    scene.add(bombTop);
    scene.add( mesh );

    scene.scale.set(0.2, 0.2, 0.2);
    return scene;
};

const heart = function(){
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
    const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
    const mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(0.007, -0.007, 0.007);
    return mesh;
};

const gun = function(){
    const scene = new THREE.Scene();
    const gunMat = new THREE.MeshBasicMaterial({color: 0x292626});
    const gunMat1 = new THREE.MeshBasicMaterial({color: 0x625E5E});

    const gunHandleGeo = new THREE.CubeGeometry(0.6, 0.75, 0.6);
    const gunTopGeo = new THREE.CubeGeometry(2, 0.6, 0.6);
    const gunTriggerGeo = new THREE.CubeGeometry(0.3, 0.35, 0.3);
    const bulletHoleGeo = new THREE.CylinderGeometry(0.125, 0.125, 1, 32);

    const GunHandle = new THREE.Mesh(gunHandleGeo, gunMat);
    GunHandle.position.x = 0.7;

    const GunTop = new THREE.Mesh(gunTopGeo, gunMat);
    GunTop.position.y = 0.5;

    const GunTrigger = new THREE.Mesh(gunTriggerGeo, gunMat1);
    GunTrigger.position.x = 0.3;
    GunTrigger.position.y = 0.1;

    const BulletHole = new THREE.Mesh(bulletHoleGeo, gunMat1);
    BulletHole.position.x = -0.65;
    BulletHole.position.y = 0.49;
    BulletHole.rotation.z = 1.555;

    scene.add(BulletHole);
    scene.add(GunTrigger);
    scene.add(GunHandle);
    scene.add(GunTop);

    scene.scale.set(0.3, 0.3, 0.3);

    return scene;
};

const trap = function(){
    const scene = new THREE.Scene();
    let numOfPoints = 0;

    const dotGeometry = new THREE.Geometry();

    while(numOfPoints <= 10000){
        const cx = Math.random();
        const cy = Math.random();
        const cz = Math.random();

        const px = (cx*2) - 1;
        const py = (cy*2) - 1;
        const pz = (cz*2) - 1;

        if (Math.pow(px, 2) + Math.pow(py, 2) + Math.pow(pz, 2) <= 1) {
            numOfPoints++;

            dotGeometry.vertices.push(new THREE.Vector3(px, py, pz));
            dotGeometry.colors.push(new THREE.Color(cx, cy, cz));
        }
    }

    var dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false, vertexColors: THREE.VertexColors  } );
    var dot = new THREE.Points( dotGeometry, dotMaterial );
    scene.add( dot );
    scene.scale.set(0.35, 0.35, 0.35);
    return scene;
};