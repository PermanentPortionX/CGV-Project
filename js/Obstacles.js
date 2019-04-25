function makeTexture(imageURL) {
    return new THREE.TextureLoader().load(imageURL);
}

const spikesTops = function(){

    return new THREE.Mesh(
        new THREE.ConeGeometry(0.9, 2, 32),
        new THREE.MeshLambertMaterial({

            color: "white",
            map: makeTexture("textures/obstacles_textures/brown.jpg")

        })
    );

};

const spikesBase = function(){
    return new THREE.Mesh(
        new THREE.BoxGeometry(10.4, 1, 1.8),
        new THREE.MeshLambertMaterial({

            color: "white",
            map: makeTexture("textures/obstacles_textures/silver.jpg")

        })
    );

};

const buildSmallSpikes = function(){

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

const buildMediumSpikes = function(){

    const ms = new THREE.Object3D();

    const sb = spikesBase();
    ms.add(sb);

    const st1 = spikesTops();
    st1.position.set(3.5,1.5,0);
    ms.add(st1);

    const st2 = spikesTops();
    st2.position.set(1.7,1.5,0);
    ms.add(st2);

    const st3 = spikesTops();
    st3.position.set(-0.1,1.5,0);
    ms.add(st3);

    const st4 = spikesTops();
    st4.position.set(-1.9,1.5,0);
    ms.add(st4);

    const st5 = spikesTops();
    st5.position.set(-3.7,1.5,0);
    ms.add(st5);

    return ms;

};

const buildLargeSpikes = function(){

    const ls = new THREE.Object3D();

    const sb = spikesBase();
    sb.scale.set(1.5,1,1);
    ls.add(sb);

    const st1 = spikesTops();
    st1.position.set(6.1,1.5,0);
    ls.add(st1);

    const st2 = spikesTops();
    st2.position.set(4.35,1.5,0);
    ls.add(st2);

    const st3 = spikesTops();
    st3.position.set(2.6,1.5,0);
    ls.add(st3);

    const st4 = spikesTops();
    st4.position.set(0.85,1.5,0);
    ls.add(st4);

    const st5 = spikesTops();
    st5.position.set(-0.9,1.5,0);
    ls.add(st5);

    const st6 = spikesTops();
    st6.position.set(-2.65,1.5,0);
    ls.add(st6);

    const st7 = spikesTops();
    st7.position.set(-4.4,1.5,0);
    ls.add(st7);

    const st8 = spikesTops();
    st8.position.set(-6.15,1.5,0);
    ls.add(st8);

    return ls;

};

//build cubes
const blocks = function(){

    return new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshLambertMaterial({

            color: "white",
            map: makeTexture("textures/obstacles_textures/silver.jpg")

        })
    );

};

const drawCube = function(){

    const S1 = new THREE.Object3D();

    const step1 = blocks();

    S1.add(step1);

    return S1;

};
//build hurdle
const hurdleTop = function(){

    return new THREE.Mesh(
        new THREE.BoxGeometry(7, 1.5, 0.5),
        new THREE.MeshBasicMaterial({color: "red"})
    );

};

const poles = function(){

    return new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 6, 0.2),
        new THREE.MeshBasicMaterial({color: "yellow"})
    );

};

const basePole = function(){

    return new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 6, 0.2),
        new THREE.MeshBasicMaterial({color: "black"})
    );

};

const bottom = function(){

    const b = new THREE.Object3D();

    const p = basePole();
    p.scale.set(1,0.5,1);
    p.position.set(-3,-5.4,-1.9);
    p.rotation.x = (Math.PI/2);
    b.add(p);

    const q = basePole();
    q.scale.set(1,0.5,1);
    q.position.set(3,-5.4,-1.9);
    q.rotation.x = (Math.PI/2);
    b.add(q);

    return b;

};

const buildHighHurdle = function(){

    const h = new THREE.Object3D();

    const ht = hurdleTop();
    h.add(ht);

    const pole1 = poles();
    pole1.position.set(-3,-2.5,-0.35);
    h.add(pole1);

    const pole2 = poles();
    pole2.position.set(3,-2.5,-0.35);
    h.add(pole2);

    const base = bottom();
    h.add(base);

    return h;

};

const buildLowHurdle = function(){

    const s = new THREE.Object3D();

    const h = buildHighHurdle();
    h.scale.set(1,0.35,1);
    s.add(h);

    return s;

};