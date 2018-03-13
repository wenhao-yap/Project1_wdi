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
var platform = 23;
var avatar = {
    x_pos: canvas.width/3,     
    y_pos: canvas.height-platform-40,
    y_spd: 0,
    gravity: 0.5,
    onGround: true
};
//load required images
var sky = new Image();
sky.src = "Images/sky.png";
var sea = new Image();
sea.src = "Images/sea.png";
var clouds = new Image();
clouds.src = "Images/clouds.png";
var ground = new Image();
ground.src = "Images/platform.png";
var farIsland = new Image();
farIsland.src = "Images/far-grounds.png";
var float1 = new Image();
float1.src = "Images/float1.png";
var float2 = new Image();
float2.src = "Images/float2.png";

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
}

function makeClouds(){
    this.x = 0;
    this.y = 60;
    this.speed = 0.2;

    this.render = function(){
        this.x -= this.speed;
        ctx.drawImage(clouds,this.x , this.y);
        ctx.drawImage(clouds,this.x + canvas.width + 45, this.y);       
        if(this.x <= -canvas.width-45){
            this.x = 0;
        }
    }
};
// function makeFarIsland(){
//     this.x = canvas.width + 2;
//     this.y = 170;
//     this.speed = 0.4;

//     this.render = function(){
//         this.x -= this.speed;
//         ctx.drawImage(farIsland,this.x , this.y,farIsland.width,farIsland.height);       
//         if(this.x <= -canvas.width-220){
//             this.x = canvas.width;
//         }
//     }
// };
function backgrdRender(image,add_x,add_y,spd,z,resize){
    this.x = add_x;
    this.y = add_y;
    this.speed = spd;

    this.render = function(){
        this.x -= this.speed;
        ctx.drawImage(image,this.x , this.y,image.width/resize,image.height/resize);      
        if(this.x <= -canvas.width-z){
            this.x = canvas.width;
        }
    }
};

// var drawClouds = new makeClouds();
// var drawFarIsland = new makeFarIsland();
var drawClouds = new makeClouds();
var drawFarIsland = new backgrdRender(farIsland,(canvas.width+100),170,0.4,300,1);
var drawFloat1 = new backgrdRender(float1,canvas.width,50,0.4,180,1);
var drawFloat2 = new backgrdRender(float2,(canvas.width+700),130,0.4,180,1);

//game loop to draw the images on canvas
function render() {
    //update necessary variables
    update();
    requestAnimFrame(render);

    now = Date.now();
    delta = now - then;

    if(delta > interval){
        then = now - (delta % interval);

        //drawing here
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //background
        ctx.drawImage(sky,0,0,112,304,0,0,canvas.width,canvas.height);
        drawClouds.render();
        ctx.drawImage(sea,0,0,112,96,0,canvas.height-platform-50,canvas.width,canvas.height);
        drawFarIsland.render();
        drawFloat1.render();
        drawFloat2.render();

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
    }    
}

/* Game Execution */
//some functionality to identify start of the game
/* Loading required sprites upon gameStart */
function gameStart(){
    //load sprites
    run = new spriteLoader("Images/running.png",31,43,6,8);
    jump = new spriteLoader("Images/jump.png",31,43,7,2);
    //game loop to draw the images on canvas
    render(drawClouds);
    render(drawFarIsland);
    render(float1);
    render(float2);
    render();
}
gameStart();