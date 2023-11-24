//   Purpose: Main driver with all functions and function uses to begin the game.
//   Authors:
//   Daniel Amirault - 
//   Emmet Dixon - 

/*Description:
    A simple game where you catch randomly spawning objects.
 */


//Global variables//

//Constant for the amount of lives to be copied into the current lives when the game starts
const lifeConstant = 3;

//Array used to store and keep track of created objects
let objectStorage = [];

//Variable to track animationFrame requests, controls when game loop starts and stops
let animationFrame;

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

// Game variables
let score = 0;
let lives = lifeConstant;

//Variable to refer to the gameCanvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get a reference to the basket with default values (top left corner of screen)
let basket = {
  width: 150,
  height: 100,
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
};

//Get a reference to the score display
const scoreDisplay = document.getElementById("score");

/*
  This function moves the basket when the user moves their mouse.
  Prevents users from moving outside the canvas boundaries.
  Current width and height of canvas get passed in.

   Author: Emmet and Daniel
*/
function moveBasket(canvasWidth, canvasHeight) {
  // Add an event listener to track mouse movement
  document.addEventListener("mousemove", (event) => {
    // Get the X-coordinate of the mouse pointer
    const mouseX = event.clientX;

    //Lock the basket to be at the bottom of the canvas
    basket.y = canvasHeight - basket.height;
    // Update the basket's left position to follow the mouse
    basket.x = mouseX;

    //Get boundary for left side of canvas
    const leftBoundary = 0;

    //Get boundary for right side of canvas (entire width of canvas minus the basket)
    const rightBoundary = canvasWidth - basket.width;

    //If the basket passes either boundary move it to the boundary
    if (basket.x < leftBoundary) {
      basket.x = leftBoundary;
    } else if (basket.x > rightBoundary) {
      basket.x = rightBoundary;
    }
  });
}

/*
  This function draws the basket onto the gameCanvas

  Author: Daniel
*/
function drawBasket() {
  const objectImage = new Image();
  objectImage.src = "../../resources/image/gameAssets/basket.png";
  ctx.drawImage(objectImage, basket.x, basket.y, basket.width, basket.height);
}

/*
  This function fits the canvas width and height to the user's browser,
  fixing issues associated with calculated boundaries of the gameCanvas
  and bluriness in text and images.

  Author: Daniel, credit to https://stackoverflow.com/questions/4037212/html-canvas-full-screen
*/
function setCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

/*
  This function displays a title screen with text. On click
  clear the screen and show the information screen.

  Author: Daniel
*/
function loadTitleScreen() {
  ctx.font = "50px Jazz LET fantasy";
  ctx.fillStyle = "black";
  ctx.fillText("Leaf catcher", canvas.width - canvas.width / 2 - 200, canvas.height - canvas.height / 2 - 100);
  ctx.font = "30px Arial";
  ctx.fillText("Game created by Daniel and Emmet", canvas.width - canvas.width / 2 - 300, canvas.height - canvas.height / 2);
  ctx.font = "30px Arial";
  ctx.fillText("Click anywhere to continue", canvas.width - canvas.width / 2 - 240, canvas.height - canvas.height / 3);
  loadObjectForScreen("../../resources/image/gameAssets/yellowBirch.png", canvas.width / 2 + 150, canvas.height - canvas.height / 1.5, 800, 800);
  loadObjectForScreen("../../resources/image/gameAssets/yellowBirch.png", -canvas.width / 7, canvas.height - canvas.height / 1.5, 800, 800);
  canvas.addEventListener("click", loadInformationScreen);
}

/*
  This function displays an information screen with text and images. On click
  clear the screen and show the rule screen.

   Author: Daniel 
*/
function loadInformationScreen() {
  canvas.removeEventListener("click", loadInformationScreen);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";

  ctx.fillText("This is a yellow birch leaf:", canvas.width/2 - 100, 100);
  ctx.fillText("Yellow birch trees use these leaves to catch sun rays to make food to grow big and strong!", canvas.width/2 - 350, 250);
  ctx.fillText("When winter arrives, the tree takes a nap! It lets go of its leaves, and rests until it's warm and sunny again!", canvas.width/2 - 415, 290);
  loadObjectForScreen("../../resources/image/gameAssets/leaf.png", canvas.width/2 - 25, 120, 100, 100);

  ctx.fillText("This our friend the squirrel:", canvas.width/2 - 100, canvas.height/2 - 25);
  ctx.fillText("He likes to collect leaves to stay warm during the winter, and nuts to eat when it gets colder!", canvas.width/2 - 350, canvas.height/2+150);
  ctx.fillText("Help him and collect as many leaves and nuts! Be careful for those sneaky stones falling!", canvas.width/2 - 350, canvas.height/2+200)
  loadObjectForScreen("../../resources/image/gameAssets/squirrel.png", canvas.width/2 - 75, canvas.height/2 - 15, 200, 150);

  ctx.font = "30px Arial";
  ctx.fillText("Click to continue!", canvas.width / 2 - 100, canvas.height - canvas.height / 8);

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

  ctx.fillText("This is a yellow birch leaf:", 230, 100);
  ctx.fillText("You should collect as many as possible!", 170, 250);
  ctx.fillText("You lose lives when you miss them!", 190, 280);
  loadObjectForScreen("../../resources/image/gameAssets/leaf.png", 320, 120, 100, 100);

  ctx.fillText("This is a hazlenut:", 665, 100);
  ctx.fillText("These restore lives!", 665, 250);
  ctx.fillText("You gain life when you catch them!", 605, 280);
  ctx.fillText("You lose lives when you miss them!", 605, 310);
  loadObjectForScreen("../../resources/image/gameAssets/nut.png", 715, 120, 100, 100);

  ctx.fillText("This is a stone:", 1100, 100);
  ctx.fillText("You should not catch these!", 1050, 250);
  ctx.fillText("You lose lives and score when you catch them!", 1000, 280)
  loadObjectForScreen("../../resources/image/gameAssets/stone.png", 1150, 130, 70, 70);

  ctx.font = "30px Arial";
  ctx.fillText("Click anywhere to begin the game!", canvas.width - canvas.width / 2 - 240, canvas.height - canvas.height / 3);

  canvas.addEventListener("click", clickToStartGame);
}

/*
  This function is based off the createObject() function.
  Load and draw the object on the screen for any of the screens
  without movement and without the object being inserted into 
  the objectStorage array.

   Author: Daniel
*/
function loadObjectForScreen(src, x, y, width, height) {
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
  gameLoop();
}

/*
  This function displays an end screen with user's score. On click
  clear the screen and restart the game loop.

   Author: Daniel  
*/
function endScreen() {
  cancelAnimationFrame(animationFrame);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "40px Arial";

  ctx.fillText("Game over!", 100, canvas.height/2 - 200);
  ctx.fillText("You scored: " + score + " points!", 100, 250);

  ctx.fillText("You helped the squirrel!", 700, 250);
  loadObjectForScreen("../../resources/image/gameAssets/squirrelFinalScreen.png", canvas.width/2 + 250, canvas.height / 2, 400, 400);


  ctx.font = "30px Arial";
  ctx.fillText("Click anywhere to restart the game!", canvas.width - canvas.width / 2 - 240, canvas.height - canvas.height / 3);

  restartGame();
}

/*
  Reset the global variables for a new gameLoop,
  update the score display and on click restart the game.

   Author: Emmet and Daniel  
*/
function restartGame() {
  score = 0;
  lives = lifeConstant;
  objectStorage = [];
  updateScoreDisplay();
  canvas.addEventListener("click", clickToStartGame);
}

/*
  This function moves the object by adding the speed in pixels to the objects y position in pixels
  at each frame.

   Author: Daniel
*/
function moveObject(object) {
  object.y += object.speed;
}

/*
  This function draws the object onto the canvas.

   Author: Daniel
*/
function drawObject(object) {
  ctx.drawImage(object.image, object.x, object.y, object.width, object.height);
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

    //chances of spawning a nut
    if (spawnValue > 0 && spawnValue < nutSpawnChance) {
      const objectImage = new Image();
      objectImage.src = "../../resources/image/gameAssets/nut.png"; //image held outside of pages/game/ path

      createObject(objectImage, 55, 55, 2.5, "nut", 200, 1, 1);
    }

    //chances of spawning a stone
    if (spawnValue > 0.25 && spawnValue < stoneSpawnChance) {
      const objectImage = new Image();
      objectImage.src = "../../resources/image/gameAssets/stone.png";

      createObject(objectImage, 35, 35, 3, "stone", -500, 0, -1);
    }

    //chances of spawning a leaf
    if (spawnValue > stoneSpawnChance && spawnValue < 1) {
      const objectImage = new Image();
      objectImage.src = "../../resources/image/gameAssets/leaf.png";

      createObject(objectImage, 75, 75, 2, "leaf", 100, 1, 0);
    }
  }
}

/*
  This function is to prevent repeated code for setting the object parameters and handling
  the asynchronous operation of loading the object's image. Need onload to prevent using image 
  before its been loaded.

  Author: Daniel
*/
function createObject(objectImage, objectWidth, objectHeight, objectSpeed, objectType, objectScore, objectLifeMiss, objectLifeCatch) {
  objectImage.onload = function () {
    //onload, create the object
    const object = {
      x: Math.random() * (canvas.width - 20), //set a random x position
      y: 0, //set the object to start at the top of the canvas
      image: objectImage, //specifies the file path of the image to be rendered
      width: objectWidth, //specifies the width for the size in pixels of the image to be rendered to
      height: objectHeight, //specifies the height for the size in pixels of the image to be rendered to
      speed: objectSpeed, //specifies the speed in pixels that object travels at
      type: objectType, //specifies the object type as a string
      score: objectScore, //specifies the associated score with catching the object
      lifeWhenMissed: objectLifeMiss, //specifies the lives associated with missing the object
      lifeWhenCaught: objectLifeCatch, //specifies the lives associated with catching the object
    };

    objectStorage.push(object);
  };
}

/*
  This funcations ends the game.

  Author: Emmet
*/

function endGame() {
  alert(`Game Over! Your final score is ${score}`);
  resetGame();
}

/*
    This function updates the display, which has the users score and number of lives.

    Author: Emmet
*/
function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score} Lives: ${lives}`;
}

/*
  This function combines tracking misses

   Author: Daniel
*/
function trackObject(object) {
  trackObjectMiss(object);
  trackObjectCatch(object);
}

/*
  This function tracks the object and recycles (restarts position) once it falls below the canvas.

  Author: Emmet and Daniel
*/
function trackObjectMiss(object) {
  if (object.y > canvas.height) {
    //if the object is greater than the height of the canvas (has passed through the bottom)
    //Lose however many lives are associated with object type
    lives -= object.lifeWhenMissed;
    updateScoreDisplay();
    if (object.type == "stone") {
      //if the object is a stone do not recycle it, splice it out of the objectStorage array
      const index = objectStorage.indexOf(object);
      objectStorage.splice(index, 1);
    } else {
      object.x = Math.random() * (canvas.width - 20); //recycle the object to a random x position
      object.y = 0; //place it back at the top
    }
  }
  if (lives == 0) {
    endScreen();
  }
}

/*
  Function that handles if an object has been caught, and splices it out of objectStorage when caught

  Author: Daniel and Emmet
*/
function trackObjectCatch(object) {
  if (object.x + object.width >= basket.x && object.x <= basket.x + basket.width && object.y + object.height >= basket.y && object.y <= basket.y + basket.height) {
    const index = objectStorage.indexOf(object); //search objectStorage and return index of object that has been registered as caught
    //Gain however many score points are associated with object type
    score += object.score;
    lives += object.lifeWhenCaught;
    updateScoreDisplay();
    if (index !== -1) {
      //indexOf returns -1 if the object is not found, therefore has already been removed therefore do not remove it
      objectStorage.splice(index, 1); //splice removes the object at the given index, and 1 represents the amount of splices that occur (1)
    }
  }
}

/*
  This function controls game loop, making calls to other functions.

   Author: Daniel
*/
function gameLoop() {
  //Update animation for next frame
  animationFrame = requestAnimationFrame(gameLoop);

  //Clear the entire gameCanvas of objects from previous sessions
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Draw the basket object onto the Canvas
  drawBasket();

  //Allow the user to move the basket on the screen
  moveBasket(canvas.width, canvas.height);

  //Decrement through the objectStorage array
  for (let i = objectStorage.length - 1; i >= 0; i--) {
    //Copy the object from the objectStorage array to the object variable
    const object = objectStorage[i];

    //Draw the object by its specifications onto the canvas, do not attempt if objectStorage is empty
    if (objectStorage.length != 0) {
      drawObject(object);

      //Track if the object has passed through the bottom of the canvas
      trackObject(object);

      //Begin moving the object
      moveObject(object);
    }
  }

  //Math.random() generates numbers between 0-1, therefore spawnRate determines the chance that a new object is created
  if (Math.random() < spawnRate) {
    //The createRandomObject() pushes a new object into the objectStorageArray
    createRandomObject();
  }
}

//Sets the canvas based of user's browser
setCanvas();
//Load title screen and allow user to begin game
loadTitleScreen();
