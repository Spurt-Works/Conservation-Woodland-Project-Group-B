//   Purpose: Main driver for the game
//   Authors:
//   Daniel Amirault  - objects falling
//   Emmet Dixon -

/*Description:
 */

//Global variables//

//Array used to store created objects
const objectStorage = [];

//Integer number used to determine the amount of objects to spawn in a single iteration
const spawnAmount = 4;

/*
  - Number from 0 to 1 used to determine the chance that new objects are created
  - Lower numbers means less chance, therefore less objects spawn per iteration
  - Higher numbers means greater chance, therefore more objects spawn per iteration
  - Increasing the rate to 1 will cause the spawnAmount number of objects to created in a single iteration because 1 --> 100 %
*/
const spawnRate = 0.02;


//Select the gameCanvas, Canvas API
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get a reference to the basket element
const basket = document.getElementById("basket");

/*
  This function moves the basket when the user moves their mouse.

   Author: Emmet
*/
function moveBasket() {
  // Add an event listener to track mouse movement
  document.addEventListener("mousemove", (event) => {
    // Get the X-coordinate of the mouse pointer
    const mouseX = event.clientX;

    // Update the basket's left position to follow the mouse
    basket.style.left = mouseX + "px";
  });
}

/*
  This function moves the object by adding the speed to the objects y position.

   Author: Daniel
*/
function moveObject(object) {
  object.y += object.speed;
}

/*
  This function tracks the object and recycles it once its position falls below the canvas.

   Author: Daniel
*/
function trackObject(object) {
  if (object.y > canvas.height) {
    object.x = Math.random() * (canvas.width - 20);
    object.y = 0;
    //objectStorage.splice(i, 1)
  }
}

/*
  This function draws the object onto the canvas.

   Author: Daniel
*/
function drawObject(object) {
  ctx.fillStyle = object.color;
  ctx.fillRect(object.x, object.y, object.width, object.height);
}

/*
  This function overclears the object path to remove it.
  No longer necessary since the basket is an HTML element

   Author: Daniel
*/
function clearObject() {
  ctx.clearRect(object.x - 0.5, object.y, object.width * 2, object.height);
}

/*
   Create the object and its initial position
    The if condition controls the amount of object being pushed into the objectStorage array
    If the spawnAmount = 3, the maximum amount of objects spawning in a single iteration is 3

   Author: Daniel
*/
function createRandomObject() {
  if (objectStorage.length < spawnAmount) {
    const object = {
      x: Math.random() * (canvas.width - 20), //start at center and randomize
      color: "red", //will be replaced by an image eventually
      width: Math.random()*5 + 2,
      height: Math.random()*5 + 1,
      y: 0,
      speed: 1, //should be changed for different types of objects
    };

    objectStorage.push(object);
  }
}

//function to cause gameCanvas to fit to browser window, not sured if it will be used
function fullScreen() {
    const canvas = document.getElementById("gameCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  }

/*
  This function controls game loop, making calls to other functions.

   Author: Daniel
*/
function gameLoop() {
  requestAnimationFrame(gameLoop);

  //Allow the user to move the basket on the screen
  moveBasket();

  //Clear the entire gameCanvas of objects from previous sessions
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Decrement through the objectStorage array
  for (let i = objectStorage.length - 1; i >= 0; i--) {
    //Copy the object from the objectStorage array to the object variable
    const object = objectStorage[i];

    //Draw the object by its specifications onto the canvas
    drawObject(object);

    //Track if the object has passed through the bottom of the canvas
    trackObject(object);

    //Begin moving the object
    moveObject(object);
  }

  //Math.random() generates numbers between 0-1, therefore spawnRate determines the chance that a new object is created
  if (Math.random() < spawnRate) {
    //The createRandomObject() pushes a new object into the objectStorageArray
    createRandomObject();
  }
}

//Starts the game loop
gameLoop();
