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


    var points = [127.584, 133.075, 140.02, 146.755, 152.913, 155.307, 158.666, 163.45, 165.514, 167.98, 168.394, 167.257, 163.742, 158.049, 150.81, 142.305, 131.651, 125.855, 114.138, 100.321, 89.3324, 84.77, 87.0588, 78.2261, 72.4406, 70.761, 71.2394, 73.3089, 76.6018, 81.7407, 92.4125, 94.4069, 100.629, 109.62, 117.106, 125.775, 133.502, 143.509, 153.066, 160.943, 168.158, 175.3, 182.29, 185.566, 191.466, 197.175, 201.725, 204.699, 206.51, 207.634, 208.492, 208.291, 208.132, 206.244, 201.839, 189.343, 185.98, 178.513, 178.513, 160.373, 151.415, 140.594, 129.869, 121.433, 113.028, 105.206, 92.5884, 90.8445, 84.3263, 80.4603, 76.0214, 74.5759, 69.939, 69.5576, 70.7713, 73.1213, 77.6562, 81.6341, 85.2186, 90.441, 102.163, 109.333, 117.102, 125.468, 134.104, 148.74, 155.553, 158.357, 161.275, 171.53, 174.56, 186.765, 192.622, 196.329, 202.075, 204.089, 204.836, 203.334, 201.35, 199.41, 194.839, 189.569, 183.564, 174.377, 165.051, 150.967, 144.126, 139.714, 125.781, 117.217, 101.823, 95.3567, 89.8235, 85.9041, 84.0404, 69.8909, 70.3476, 71.8308, 63.0687, 62.1171, 61.6176, 52.393];

    var normalize = 200;
    var i = 0;
    var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    for(i=0; i<points.length; i++)
    {
        var geometry2 = new THREE.BoxGeometry( 20, 20, 20 );
        var cube2 = new THREE.Mesh( geometry2, material2 );

        var x = -500+(i*10);

        cube2.position.set(x, points[i], 10);

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
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

   event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // raycaster.setFromCamera( mouse, camera );

    // var intersects = raycaster.intersectObjects( objects );

    // if ( intersects.length > 0 ) {

    //     var intersect = intersects[ 0 ];

    //     rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
    //     rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

    // }

    render();

}

function render() {

    renderer.render( scene, camera );

}