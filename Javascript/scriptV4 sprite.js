/*GLOBAL VARIABLES*/
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var platform = 25;
var avatar = {
    x_pos: canvas.width/4-platform,     
    y_pos: canvas.height-platform-40,
    y_spd: 0,
    gravity: 0.5,
    onGround: true
};

/* Keyboard Controls */
document.addEventListener("keydown",function(event){
    if(event.keyCode == 32 || event.keyCode == 38){
        startJump();
    }
});
document.addEventListener("keyup",function(event){
    if(event.keyCode == 32 || event.keyCode == 38){
        endJump();
    }
});
function startJump(){
    if(avatar.onGround == true){
        avatar.y_spd = -8;
        avatar.onGround = false;
    }
};
function endJump(){
    if(avatar.y_spd < -4 ){
        avatar.y_spd = -4;
        avatar.onGround = false;
    }
};

/* Loading required files upon gameStart */
function gameStart(){
    //load sprites
    run = new spriteLoader("Images/running.png",31,43,6,8);
    jump = new spriteLoader("Images/jump.png",31,43,7,2);
    //game loop to draw the images on canvas
    render();
}


/* GamePlay */
function update(){
    //Update Avatar parameters
    avatar.y_spd += avatar.gravity;
    avatar.y_pos += avatar.y_spd;
    //to prevent falling down the platform
    if(avatar.y_pos > canvas.height-40-platform)
    {
        avatar.y_pos = canvas.height-40-platform;
        avatar.y_spd = 0;
        avatar.onGround = true;
    }
    //prevent going out of screen height. not possible but precaution
    var ceiling = 0;
    if(avatar.y_pos <= ceiling){
        avatar.y_pos = ceiling;
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