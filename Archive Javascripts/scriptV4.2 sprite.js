var requestAnimFrame = (function(){
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
         function(callback, element){
           window.setTimeout(callback, 1000 / 60);
         };
})();

var fps = 60;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

/*GLOBAL VARIABLES*/
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var platform = 31;
var avatar = {
    x_pos: canvas.width/3,     
    y_pos: canvas.height-platform-40,
    y_spd: 0,
    gravity: 0.5,
    onGround: true
};
var score = 0;
var ground = new Image();
ground.src = "Images/platform2.png";

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

/* GamePlay */
function update(){
    //Update Avatar parameters
    avatar.y_spd += avatar.gravity;
    avatar.y_pos += avatar.y_spd;
    //to prevent falling down the platform
    if(avatar.y_pos > canvas.height-60-platform)
    {
        avatar.y_pos = canvas.height-60-platform;
        avatar.y_spd = 0;
        avatar.onGround = true;
    }
    //prevent going out of screen height. not possible but precaution
    var ceiling = 0;
    if(avatar.y_pos <= ceiling){
        avatar.y_pos = ceiling;
    }

    score++
}

//detect collision and game over
function gameOver(){
        //case1: avatar right touches obstacle left
    if(((avatar.x_pos + avatar.width) >= obstacles[0].x_pos)
        && //case 2: avatar left touches obstacle right
        (avatar.x_pos <= (obstacles[0].x_pos + obstacles[0].width))
        && //case 3: avatar bottom touch obstacle top
        ((avatar.y_pos + avatar.height) >= obstacles[0].y_pos)){
        //reload page
        location.reload();
    }
    else{
        score++;
    }
};

//game loop to draw the images on canvas
function render() {
    //update necessary variables
    update();
    requestAnimFrame(render);

    now = Date.now();
    delta = now - then;

    if(delta > interval){
        then = now - (delta % interval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Platform
        for(var i=0;i<=canvas.width;i+=16){
            ctx.drawImage(ground,i,canvas.height-platform-25);
        }

        //Avatar
        //if avatar not on the ground, trigger jump animation
        if(avatar.onGround == false){
            jump.update();
            jump.draw(avatar.x_pos,avatar.y_pos);
        }
        //if avatar on the ground
        else if(avatar.onGround == true){ 
            run.update(); 
            run.draw(avatar.x_pos,avatar.y_pos);
        }

        //Obstacles
        

        //scoreBoard
        ctx.font = "14px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + Math.floor(score/10),100,50);
    }    
}

/* Game Execution */
//some functionality to identify start of the game
/* Loading required sprites upon gameStart */
function gameStart(){
    //load sprites
    run = new spriteLoader("Images/running.png",31,43,6,8);
    jump = new spriteLoader("Images/jump.png",31,43,7,2);
    skeleton_walk = new spriteLoader("Images/skeleton_walk.png",32,43,5,13);
    skeleton_attack = new spriteLoader("Images/skeleton_attack.png",53,47,6,13);
    //game loop to draw the images on canvas
    render();
}
gameStart();