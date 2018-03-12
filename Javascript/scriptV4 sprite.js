/*GLOBAL VARIABLES*/
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var platform = 25;
var avatar = {
    x_pos: canvas.width/4-platform,     
    y_pos: canvas.height-platform-40,

    //added
    // y_spd: 0,
    // gravity: 0.5,
    // onGround: true
};

/* Loading required files upon gameStart */
function gameStart(){
    //load sprites
    run = new spriteLoader("Images/running.png",31,43,6,8);
    jump = new spriteLoader("Images/jump.png",)
    //game loop to draw the images on canvas
    render();
}

//resources for parallax background


//assign parameters to image so can adjust its speed



/* GamePlay */
function update(){
    //to prevent falling down the platform
    if(avatar.y_pos > canvas.height-avatar.height-platform)
    {
        avatar.y_pos = canvas.height-avatar.height-platform;
        avatar.y_spd = 0;
        avatar.onGround = true;
    }
}

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
    run.update(); 
    run.draw(avatar.x_pos,avatar.y_pos);
}

/* Game Execution */
//some functionality to identify start of the game
gameStart();