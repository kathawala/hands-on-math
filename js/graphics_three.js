if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer;
var plane;
var mouse, raycaster; 
var threshold = 0.1;
var drawing = false;
var lines = [];
var currentLine = {
  points: [],
  shapes: []
};
//x and y params maps to points and filename (uuid)
var storeFileURL = "https://www.wolframcloud.com/objects/0a7037b4-26ba-4463-ba10-60f6ec755ea2urle";
//p param maps to uuid
var readFunctionURL = "https://www.wolframcloud.com/objects/e1cf291a-ba0e-4f9b-a1b7-2be629c2bbae";


var objects = [];

init();
render();

function init() {

    container = document.getElementById( 'container' );


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

function render() {

  var options = {enableGestures: true};
  var prevPosition = null;
  var tapped = null;
  var pointing = 1 //represents only index finger extended  

  renderer.render( scene, camera );

  var controller = Leap.loop(options, function(frame) {
    var hand = frame.hands[0];
    if (!hand) return;
    
    var extended_fingers = 0;
    var index = null;
    for (var i=0; i<hand.fingers.length; i++) {  
      var x = hand.fingers[i];
      if (x.extended) extended_fingers += 1;
      if (x.type = "index") index = x;
    }

    if (extended_fingers == pointing && !drawing){
      drawing = !drawing;
    } else if (extended_fingers != pointing && drawing){
      lines.push(currentLine);
      currentLine = {
	points: [],
	shapes: []
      }
      drawing = !drawing;
    }
    
    if (drawing) {
      var finger = index;
      var currentPosition = finger.tipPosition;
      currentLine.points.push(currentPosition);
      
      var geometry2 = new THREE.BoxGeometry( 10, 10, 10 );
      
      var material2 = new THREE.MeshBasicMaterial( { color: new THREE.Color(0, 0x000000, 0) } );

      //var sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
      //var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, shading: THREE.FlatShading } );

      var cube2 = new THREE.Mesh(geometry2, material2);
      cube2.position.set(currentPosition[0]*(3)-50, currentPosition[1], 800);
      currentLine.shapes.push(cube2);
      
      scene.add( cube2 );
      
      renderer.render( scene, camera );  
    }
    
  });

  controller.on('gesture', function(gesture) {
    if (gesture.type == "swipe" && !drawing && gesture.state == 'stop') {
      if (lines.length == 0) return;
      var lastLine = lines[lines.length-1];
      for(var i=0; i<lastLine.shapes.length; i++) {
	var index = lines.indexOf(lastLine);
	if (index > -1) lines.splice(index, 1);
	scene.remove( lastLine.shapes[i] );
      }
      renderer.render( scene, camera );
    }
  });

}

function wolframizeNestedArray (points) {
  var pointString = "";
  for (var i = 0; i < points.length; i ++) {
    var point = points[i];
    point.splice(-1,1);
    var xyzString = "{" + point.toString() + "}";
    if (pointString == "") xyzString = "{" + xyzString;
    if (i == points.length-1) xyzString = xyzString + "}"
    else xyzString = xyzString + ","
    pointString += xyzString;
  }
  return pointString;
}

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

document.onkeypress = function (event) {
  var oEvent = event || window.event, chr = oEvent.keyCode;
  if ((chr == 0 || chr == 32) && lines.length != 0) { //handle space bar click
    var line = lines[lines.length-1];
    line.uuid = guid();
    var points = line.points;
    var wolframString = wolframizeNestedArray(points);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            console.log(xmlHttp.responseText);
    }
    xmlHttp.open("GET", storeFileURL + "?x=" + encodeURIComponent(wolframString) + "&y=" + encodeURIComponent(line.uuid), true); // true for asynchronous 
    xmlHttp.send(null);
  }
}