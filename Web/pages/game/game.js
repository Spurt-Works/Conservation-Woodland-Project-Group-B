const canvas = document.getElementById("gameCanvas");

// Get a reference to the basket element
const basket = document.getElementById('basket');

/*
  This function moves the basket when the user moves their mouse.

   Author: Emmet
*/
function moveBasket(){
  // Add an event listener to track mouse movement
  document.addEventListener('mousemove', (event) => {
    // Get the X-coordinate of the mouse pointer
    const mouseX = event.clientX;

    // Update the basket's left position to follow the mouse
    basket.style.left = mouseX + 'px';
  });
}
