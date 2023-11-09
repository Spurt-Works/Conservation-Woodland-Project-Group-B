//   Purpose: Main driver for the game
//   Authors:
//   Daniel Amirault  - objects falling
//   Emmet Dixon -

/*Description:
 */

//Global variables//

//Array used to store created objects
const objectStorage = [];

//Integer number used to determine the amount of objects to spawn in a single iteration, before being caught
//If you set to 4, and the user does not catch any of them, the same 4 objects will continue appearing
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
  This function tracks the object and recycles (restarts position) once it falls below the canvas.

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
  ctx.drawImage(object.image, object.x, object.y, object.width, object.height);
}

/*
  This function overclears the object path to remove it.
  No longer necessary since the basket is an HTML element keeping for future reference

   Author: Daniel
*/
function clearObject() {
  ctx.clearRect(object.x - 0.5, object.y, object.width * 2, object.height);
}

/*
    Create a random object according to random spawnValue and spawnChances controlled by the spawnAmount
  
    The if condition with "spawnAmount" controls amount of object being pushed into the objectStorage array
    If the spawnAmount = 3, the maximum amount of objects spawning in a single iteration is 3

    spawnValue is a random number between 0-1, spawnRates control the amount of chance for a type of Object to spawn
      nutSpawnChance: 0 -> 0.25 therefore 25% chance
      stoneSpawnChance: 0.25 -> 0.35 therefore 10 % chance
      (implied leafSpawnChance): 0.35 -> 1 therefore 65 % chance

   Author: Daniel
*/
function createRandomObject() {
  const nutSpawnChance = 0.25;
  const stoneSpawnChance = 0.35;

  if (objectStorage.length < spawnAmount) {
    let spawnValue = Math.random(); //values between 0-1

    if (spawnValue > 0 && spawnValue < nutSpawnChance) {
      const objectImage = new Image();
      objectImage.src = "../../resources/image/gameAssets/nut.png"; //image held outside of pages/game/ path

      createObject(objectImage, 20, 20, 1.25);
    }

    if (spawnValue > 0.25 && spawnValue < stoneSpawnChance) {
      const objectImage = new Image();
      objectImage.src = "../../resources/image/gameAssets/stone.png";

      createObject(objectImage, 10, 10, 1.5);
    }

    if (spawnValue > stoneSpawnChance && spawnValue < 1) {
      const objectImage = new Image();
      objectImage.src = "../../resources/image/gameAssets/leaf.png";

      createObject(objectImage, 25, 25, 1);
    }
  }
}



/*
  This function is to prevent boilerplate code for setting the object parameters and handling
  the asynchronous operation of loading the object's image. Need onload to prevent using image 
  before its been loaded.

   Author: Daniel
*/
function createObject(objectImage, objectWidth, objectHeight, objectSpeed) {
  objectImage.onload = function () {
    const object = {
      x: Math.random() * (canvas.width - 20),
      image: objectImage,
      width: objectWidth,
      height: objectHeight,
      y: 0,
      speed: objectSpeed,
    };

    objectStorage.push(object);
  };
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

  //Clear the entire gameCanvas of objects from previous sessions
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Allow the user to move the basket on the screen
  moveBasket();

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
    console.log(Math.random());
    //The createRandomObject() pushes a new object into the objectStorageArray
    createRandomObject();
  }
}

//Starts the game loop
gameLoop();
