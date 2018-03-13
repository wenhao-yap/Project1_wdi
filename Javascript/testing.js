/*GLOBAL VARIABLES*/
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var platform = 25;
var avatar = {
    x_pos: canvas.width/4-platform,     
    y_pos: canvas.height-platform-40,
};

/* Loading required files upon gameStart */
function gameStart(){
    //load sprites
    kitty = new spriteLoader("Images/kitty.png",35,50,6,5);
    //game loop to draw the images on canvas
    render();
}


/* GamePlay */

//game loop to draw the images on canvas
function render() {
    //update necessary variables
    update();
    requestAnimationFrame(render);

    //drawing here
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Parallax background

    //Platform
    ctx.moveTo(0,canvas.height-platform);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.lineTo(canvas.width,canvas.height-platform);
    ctx.stroke();

   //Avatar 
    if(avatar.onGround == false){
        jump.update();
        jump.draw(avatar.x_pos,avatar.y_pos);
    }
    //if avatar on the ground
    else if(avatar.onGround == true){ 
        run.update(); 
        run.draw(avatar.x_pos,avatar.y_pos);
    }   
}

/* Game Execution */
//some functionality to identify start of the game
gameStart();