//check isShiftDown??? 
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer;
var plane;
var mouse, raycaster, isShiftDown = false; 
var threshold = 0.1;

var objects = [];

init();
render();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 00, 500, 2000 ); 
    camera.lookAt( new THREE.Vector3() );


    scene = new THREE.Scene();
    // var sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
    // var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, shading: THREE.FlatShading } );

    // grid

    var size = 1000, step = 50;

    var geometry = new THREE.Geometry();

    for ( var i = - size; i <= size; i += step ) {

        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

    }

    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );

    var line = new THREE.LineSegments( geometry, material );
    scene.add( line );


    x = [28.2588, 30.0746, 36.3025, 42.8052, 47.8761, 52.3432, 57.6151, 63.5475, 69.1289, 74.8265, 79.931, 86.177, 89.0149, 93.8196, 100.635, 106.194, 111.714, 123.139, 128.99, 134.565, 140.327, 145.194, 154.099, 155.848, 161.705, 168.087, 179.281, 184.172, 194.813, 199.067, 202.976, 212.922, 218.222, 220.45, 224.57, 239.303, 244.466, 249.058, 263.924, 255.789, 242.616, 242.448, 242.505]

    y = [114.873, 117.073, 122.393, 129.262, 132.528, 136.106, 140.798, 146.331, 152.026, 157.82, 164.176, 170.563, 175.12, 180.289, 187.326, 192.737, 197.836, 210.935, 217.717, 223.593, 230.212, 236.339, 247.148, 249.103, 255.404, 263.247, 277.467, 283.556, 296.633, 301.727, 306.57, 318.898, 324.862, 327.366, 330.613, 343.522, 348.842, 353.683, 370.12, 318.878, 300.068, 300.141, 300.244]

    z = [-8.05111, -7.69075, -7.58149, -6.75371, -6.2317, -5.94001, -5.52248, -5.55702, -5.22401, -4.15805, -3.31618, -2.49574, -1.78443, -0.105879, 4.20596, 5.94571, 7.23719, 9.9411, 11.8348, 11.9705, 13.0656, 14.7029, 17.5228, 17.8717, 18.0709, 19.9709, 22.0203, 23.5826, 26.8027, 27.7695, 28.8479, 32.2673, 32.7009, 34.1674, 34.7817, 36.954, 38.69, 39.1486, 43.0898, 54.5245, 84.8876, 86.5778, 86.7768]
    var normalize = 209;
    var i = 0;
    
    for(i=0; i<x.length; i++)
    {
        var geometry2 = new THREE.BoxGeometry( 20, 20, 20 );

        var material2 = new THREE.MeshBasicMaterial( { color: new THREE.Color(0, 0x000000, 0) } );


        var cube2 = new THREE.Mesh( geometry2, material2 );

        cube2.position.set(x[i], y[i], z[i]);

        scene.add( cube2 );
    }



    //

    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = threshold;

    mouse = new THREE.Vector2();


    //var geometry = new THREE.BoxGeometry( 500, 1000, 1000);
    //  var geometry = new THREE.BoxGeometry( 2800, 1000, 1000);  // aashna
    // // geometry.rotateX( - Math.PI / 2 );

    // plane = new THREE.Mesh( geometry, new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 0.2, transparent: true, visible: true } ) );
    // scene.add( plane );

    objects.push( plane );


    // var geometry2 = new THREE.BoxGeometry( 200, 200, 300 );
    // var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // var cube2 = new THREE.Mesh( geometry2, material2 );
    // scene.add( cube2 );





    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

// function onDocumentMouseMove( event ) {

//    event.preventDefault();

//     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//     // raycaster.setFromCamera( mouse, camera );

//     // var intersects = raycaster.intersectObjects( objects );

//     // if ( intersects.length > 0 ) {

//     //     var intersect = intersects[ 0 ];

//     //     rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
//     //     rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

//     // }

//     render();

// }

function render() {

    renderer.render( scene, camera );

}