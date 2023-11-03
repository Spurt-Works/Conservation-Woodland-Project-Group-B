//   Purpose: Main driver for the game
//   Authors: 
//   Daniel Amirault  - objects falling
//   Emmet Dixon -

/*Description: 
*/

//Select the gameCanvas, Canvas API
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Create the object and its initial position
const object = {
  x: Math.random() * (canvas.width - 20), //start at random position
  color: "red", //will be replaced by an image eventually
  width: 5,
  height: 5,
  y: 0,
  speed: 2, //should be changed for different types of objects
};


//Function to draw the object on the gameCanvas
function drawObject() {
  ctx.fillStyle = object.color;
  ctx.fillRect(object.x, object.y, object.width, object.height);
}

function clearObject() {
    ctx.clearRect(object.x, object.y, object.width, object.height);
}

//Begin game loop
function gameLoop() {
    clearObject(); //weird trailing effect

  //Move the object
  object.y += object.speed;

  //Object is below canvas, reset position
  if (object.y > canvas.height) {
    object.x = Math.random() * (canvas.width - 20);
    object.y=0;
  }

  drawObject();

  requestAnimationFrame(gameLoop);
}

//function to cause gameCanvas to fit to browser window
function fullScreen() {
  const canvas = document.getElementById("gameCanvas");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}

gameLoop();
