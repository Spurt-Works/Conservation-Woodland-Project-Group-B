//   Purpose: Main driver for the game
//   Authors:
//   Daniel Amirault  - objects falling, title screen
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
  This function fixes the bluriness of canvas elements due to upscaling to browser size.

  We did not write this, full credit goes this article: 
  https://web.dev/articles/canvas-hidipi

   Author: Paul Lewis, implented into loadTitleScreen() Code by Daniel
*/
function setCanvas(canvas) {
  // Get the device pixel ratio, falling back to 1.
  var dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  var rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext("2d");
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  return ctx;
}

/*
  This function displays a title screen with text. On click
  clear the screen and show the rule screen.

   Author: Daniel 
*/
function loadTitleScreen() {
  setCanvas(canvas);
  ctx.font = "50px Jazz LET fantasy";
  ctx.fillStyle = "black";
  ctx.fillText("Game Title", 70, 50);
  ctx.font = "10px Arial";
  ctx.fillText("Game created by Daniel and Emmet", 70, 100);
  canvas.addEventListener("click", loadRuleScreen);
}

/*
  This function displays a rule screen with text and images. On click
  clear the screen and begin the game loop.

   Author: Daniel 
*/
function loadRuleScreen() {
  canvas.removeEventListener("click", loadRuleScreen);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";

  ctx.fillText("This is a yellow birch leaf:", 100, 100);
  ctx.fillText("You should collect as many as possible!", 50, 250);
  loadObjectRuleScreen("../../resources/image/gameAssets/leaf.png", 150, 120, 100, 100);
  ctx.fillText("This is a hazlenut:", 450, 100);
  ctx.fillText("These restore lives!", 450, 250);
  loadObjectRuleScreen("../../resources/image/gameAssets/nut.png", 500, 120, 100, 100);
  ctx.fillText("This is a rock:", 820, 100);
  ctx.fillText("You should avoid these! They remove lives!", 700, 250);
  loadObjectRuleScreen("../../resources/image/gameAssets/stone.png", 850, 130, 70, 70);
  canvas.addEventListener("click", clickToStartGame);
}

/*
  This function is based off the createObject() function.
  Load and draw the object on the screen for the rule screen 
  without movement and without the object being inserted into 
  the objectStorage array.

   Author: Daniel
*/
function loadObjectRuleScreen(src, x, y, width, height) {
  const loadImage = new Image();
  loadImage.src = src;

  loadImage.onload = function () {
    const object = {
      x: x,
      y: y,
      image: loadImage,
      width: width,
      height: height,
    };
    drawObject(object);
  };
}

/*
  This function removes the listener for clicks to start the game.
  Show the basket and begin the game loop.

   Author: Daniel 
*/
function clickToStartGame() {
  canvas.removeEventListener("click", clickToStartGame);
  basket.style.display = "block";
  gameLoop();
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

      createObject(objectImage, 55, 55, 2.5);
    }

    if (spawnValue > 0.25 && spawnValue < stoneSpawnChance) {
      const objectImage = new Image();
      objectImage.src = "../../resources/image/gameAssets/stone.png";

      createObject(objectImage, 35, 35, 3);
    }

    if (spawnValue > stoneSpawnChance && spawnValue < 1) {
      const objectImage = new Image();
      objectImage.src = "../../resources/image/gameAssets/leaf.png";

      createObject(objectImage, 75, 75, 2);
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
      y: 0,
      image: objectImage,
      width: objectWidth,
      height: objectHeight,
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
  //Update animation for next frame
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
    //The createRandomObject() pushes a new object into the objectStorageArray
    createRandomObject();
  }
}

loadTitleScreen();
