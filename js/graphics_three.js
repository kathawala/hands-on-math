if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer;
var plane;
var mouse, raycaster; 
var threshold = 0.1;
var drawing = false;
var shouldSend = true;
var lines = [];
var currentLine = {
  points: [],
  shapes: []
};
//x and y params maps to points and filename (uuid)
var storeFileURL = "https://www.wolframcloud.com/objects/3f9948cd-2b38-4a9a-9a71-9d6da239760c";
//p param maps to uuid
var readFunctionURL = "https://www.wolframcloud.com/objects/63476e15-9230-4a9b-adeb-32e06f731fd8";

//each point is about 16 characters (two curly braces, 4 commas, 9 digits, 1 space)
//2000 / 16 = 125
var maxPoints = 135;


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
      shouldSend = true;
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
      cube2.position.set(currentPosition[0]*(3)-50, currentPosition[1], 900);
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
  var modulo = maxPoints;
  if (points.length > maxPoints) {
    modulo = dividePoints(points.length);
  }
  for (var i = 0; i < points.length; i ++) {
    if (i < 5 || i > points.length - 5) continue;
    if (i % modulo == 0) continue;
    var point = points[i];
    point.splice(-1,1);
    if (point.length != 2) continue;
    for (var j = 0; j < point.length; j++) {
      point[j] = Math.round(point[j]);
    }
    var xyzString = "{" + point.toString() + "}";
    if (pointString == "") xyzString = "{" + xyzString;
    pointString += xyzString;
    pointString += ",";
  }
  pointString = pointString + "}"
  pointString = pointString.replace("},}", "}}");
  console.log(pointString);
  console.log(points.length);
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
  if ((chr == 0 || chr == 32) && lines.length != 0 && shouldSend) { //handle space bar click
    var loadbar = document.getElementById("load-bar");
    var formulabox = document.getElementById("formula");
    formulabox.style.color = "#F7D5CB";
    formulabox.style.border = "2px solid #F7D5CB";
    loadbar.style.visibility = "visible";
    shouldSend = false;
    var line = lines[lines.length-1];
    line.uuid = guid();
    console.log(line.uuid);
    var points = line.points;
    var wolframString = wolframizeNestedArray(points);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
	var xhr2 = new XMLHttpRequest();
	xhr2.onreadystatechange = function() {
	  if (xhr2.readyState == 4 && xhr2.status == 200) {
	    var expression = xhr2.responseText;
	    loadbar.style.visibility = "hidden";
	    formulabox.style.color = "#f35626";
	    formulabox.style.border = "2px solid #f35626";
	    formulabox.innerHTML = expression;
	    formulabox.style.left = ((formulabox.parentElement.clientWidth - formulabox.clientWidth) / 2) + "px";
	    // var xhr3 = new XMLHttpRequest();
	    // xhr3.onreadystatechange = function() {
	    //   if (xhr3.readyState == 4 && xhr3.status == 200) {
	    // 	var linePlot = xhr3.responseText;
	    // 	////////////////

	    // 	// Parse the wolfram back to javascript array of points here and then plot
		
	    // 	////////////////
	    // 	console.log(linePlot);
	    //   }
	    // }
	  } else if (xhr2.status == 414 || xhr2.status == 400) {
	    var expression = "Yikes! Server Error :(";
	    loadbar.style.visibility = "hidden";
	    formulabox.style.color = "#f35626";
	    formulabox.style.border = "2px solid #f35626";
	    formulabox.innerHTML = expression;
	    formulabox.style.left = (formulabox.parentElement.clientWidth - formulabox.clientWidth) / 2;
	  }
	}
	xhr2.open("GET", readFunctionURL + "?p=" + encodeURIComponent(line.uuid), true);
	xhr2.send(null);
      } else if (xmlHttp.status == 414 || xmlHttp.status == 400) {
	var expression = "Yikes! Server Error :(";
	loadbar.style.visibility = "hidden";
	formulabox.style.color = "#f35626";
	formulabox.style.border = "2px solid #f35626";
	formulabox.innerHTML = expression;
	formulabox.style.left = (formulabox.parentElement.clientWidth - formulabox.clientWidth) / 2;
      }
      
    }
    xmlHttp.open("GET", storeFileURL + "?x=" + encodeURIComponent(wolframString) + "&y=" + encodeURIComponent(line.uuid), true); // true for asynchronous 
    xmlHttp.send(null);
  }
}

// returns modulo to divide by
function dividePoints (totalNumOfPoints) {
  return Math.round(totalNumOfPoints / (totalNumOfPoints - maxPoints));
  
}