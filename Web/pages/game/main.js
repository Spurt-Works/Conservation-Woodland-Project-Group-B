

//function to cause gameCanvas to fit to browser window
function fullScreen() {
    const canvas = document.getElementById("gameCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
}
