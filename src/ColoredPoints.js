// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const LINE = 3;
const DRAW = 4;
// Globals related UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedCircleSegments = 5;

function addActionsForHtmlUI() {
  // Button events
  document.getElementById("green").onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0];};
  document.getElementById("red").onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0];};
  document.getElementById("clearButton").onclick = function() { g_shapesList = []; renderAllShapes();};

  document.getElementById("pointButton").onclick = function() { g_selectedType = POINT;};
  document.getElementById("triangleButton").onclick = function() { g_selectedType = TRIANGLE;};
  document.getElementById("circleButton").onclick = function() { g_selectedType = CIRCLE;};
  document.getElementById("lineButton").onclick = function() { g_selectedType = LINE;};
  document.getElementById("drawButton").onclick = function() { drawPicture();};

  // Slider events
  document.getElementById("redSlide").addEventListener("mouseup", function() { g_selectedColor[0] = this.value/100;});
  document.getElementById("greenSlide").addEventListener("mouseup", function() { g_selectedColor[1] = this.value/100;});
  document.getElementById("blueSlide").addEventListener("mouseup", function() { g_selectedColor[2] = this.value/100;});
  document.getElementById("alphaSlide").addEventListener("mouseup", function() { g_selectedColor[3] = this.value/100;});
  
  // Size slider events
  document.getElementById("sizeSlide").addEventListener("mouseup", function() { g_selectedSize = this.value; });
  document.getElementById("circleSegments").addEventListener("mouseup", function() { g_selectedCircleSegments = this.value; });
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();  
  // set up actions fpr html elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev) {lineMouseDown(ev); click(ev);};

  canvas.onmousemove = function(ev) { if (ev.buttons == 1) {click(ev);}};

  canvas.onmouseup = function(ev) {lineMouseUp(ev);};
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function drawPicture() {
  console.log("drawing picture");
  let vertices = [
    [0.2, 0.55, 0.4, 0.7, 0.5, 0.55],
    [-0.5, -0.3, 0.5, -0.3, 0, 0.2],
    [-0.5, -0.3, 0.5, -0.3, 0, -0.8],
    [-0.5, -0.3, 0, 0.2, -0.3, 0.2],
    [0.5, -0.3, 0, 0.2, 0.3, 0.2],
    [0.3, 0.2, -0.3, 0.2, 0.2, 0.7],
    [0.2, 0.7, 0.2, 0.5, 0.4, 0.7],

    [-0.5, -0.3, -0.5, 0.2, -0.3, 0.2],
    [0.5, -0.3, 0.5, 0.2, 0.3, 0.2],

    [0.5, 0.2, 0.7, 0, 0.5, 0],
    [-0.5, 0.2, -0.7, 0, -0.5, 0],

    [-0.7, 0, -0.55, 0, -0.7, -0.15],
    [0.7, 0, 0.55, 0, 0.7, -0.15],

    [-0.7, -0.15, -0.8, -0.3, -0.6, -0.3],
    [0.7, -0.15, 0.8, -0.3, 0.6, -0.3],

    [-0.35, -0.35, 0, -0.7, 0.35, -0.35],
    [-0.2, -0.4, 0, -0.6, 0.2, -0.4],

    [-0.05, -0.25, -0.15, 0, -0.15, -0.25],
    [-0.3, -0.15, -0.15, 0, -0.15, -0.25],


    [0.05, -0.25, 0.15, 0, 0.15, -0.25],
    [0.3, -0.15, 0.15, 0, 0.15, -0.25],

    [-0.05, -0.25, -0.15, -0.25, -0.17, -0.15],
    [0.05, -0.25, 0.15, -0.25, 0.17, -0.15],

    [-0.07, -0.25, -0.13, -0.25, -0.15, -0.18],
    [0.07, -0.25, 0.13, -0.25, 0.15, -0.18],

    [0, -0.33, -0.05, -0.28, 0.05, -0.28],
  ]
  let colors = [
    [1.0, 1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0, 1.0],
    [1.0, 0.3, 0.3, 1.0],
    [1.0, 0.3, 0.3, 1.0],
    [1.0, 0.3, 0.3, 1.0],
    [1.0, 0.3, 0.3, 1.0],

    [1.0, 0.5, 0.3, 1.0],
    [1.0, 0.5, 0.3, 1.0],

    [1.0, 0.5, 0.3, 1.0],
    [1.0, 0.5, 0.3, 1.0],

    [1.0, 0.5, 0.3, 1.0],
    [1.0, 0.5, 0.3, 1.0],

    [1.0, 1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0, 1.0],

    [1.0, 0.3, 0.3, 1.0],// mouth
    [1.0, 1.0, 1.0, 1.0],

    [0.8, 0.8, 0.2, 1.0], //eyes
    [0.8, 0.8, 0.2, 1.0],
    [0.8, 0.8, 0.2, 1.0],
    [0.8, 0.8, 0.2, 1.0],
    // pupils
    [1.0, 1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0, 1.0],

    [0.5, 0.5, 0.5, 1.0],
    [0.5, 0.5, 0.5, 1.0],

    [0.7, 0.7, 0.7, 1.0], //nose


  ]

  for (let i = 0; i < vertices.length; ++i) {
    drawTriangleWithColor(vertices[i], colors[i]);
  }
}

var g_shapesList = [];
var lineActive = false;

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function lineMouseDown(ev) {
  [x, y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType == LINE) {
    lineActive = true;
    point = new Line();
  } else {
    return;
  }

  point.position = [];
  point.position.push(x);
  point.position.push(y);
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
}

function lineMouseUp(ev) {
  [x, y] = convertCoordinatesEventToGL(ev);

  lineActive = false;
}
function click(ev) {
  [x, y] = convertCoordinatesEventToGL(ev);

  // Create and store the new point
  let point;
  if (g_selectedType == POINT) {
  point = new Point();
  }
  else if (g_selectedType == TRIANGLE) {
  point = new Triangle();
  } else if (g_selectedType == CIRCLE) {
    point = new Circle();
    point.segments = g_selectedCircleSegments;
  } else if (g_selectedType == LINE) {
    // line so do something weird
    if (lineActive) {
      // this condition probably isnt needed now that i think about it
      let currentLine = g_shapesList.at(-1);
      currentLine.position.push(x);
      currentLine.position.push(y);
    }
    renderAllShapes();
    return;
  } else {
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  // g_points.push([x, y]);
  // Store the coordinates to g_points array
  // g_colors.push(g_selectedColor.slice());

  // Store the size to the g_sizes array
  // g_sizes.push(g_selectedSize);

    // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  // Draw every shape that is supposed to be on the canvas
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {

  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y]);
}

function renderAllShapes() {
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}