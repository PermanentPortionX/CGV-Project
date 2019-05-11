function makeTexture(imageURL) {
    return new THREE.TextureLoader().load(imageURL);
}

const spikesTops = function(){
    return new THREE.Mesh(
        new THREE.ConeGeometry(0.9, 2, 32),
        new THREE.MeshBasicMaterial({
            map: makeTexture("textures/obstacles_textures/dark_brown.png")
        })
    );
};

const spikesBase = function(){
    return new THREE.Mesh(
        new THREE.BoxGeometry(10.4, 1, 1.8),
        new THREE.MeshBasicMaterial({
            map: makeTexture("textures/obstacles_textures/wood.jpeg")
        })
    );
};

const buildSpikes = function(){
    const ss = new THREE.Object3D();
    const sb = spikesBase();
    sb.scale.set(0.45,1,1);
    ss.add(sb);
    const st1 = spikesTops();
    st1.position.set(0.85,1.5,0);
    ss.add(st1);
    const st2 = spikesTops();
    st2.position.set(-0.9,1.5,0);
    ss.add(st2);
    return ss;
};

//build cubes
const blocks = function(){
    return new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({
            map: makeTexture("textures/obstacles_textures/silver.jpg")
        })
    );
};

const buildCube = function(){
    const S1 = new THREE.Object3D();
    const step1 = blocks();
    S1.add(step1);
    return S1;
};