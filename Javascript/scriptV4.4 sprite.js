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

/** Load image resources */
var ground = new Image();
ground.src = "Images/platform2.png";
var floatEnemy = new Image();
floatEnemy.src = "Images/Mace.png";
run = new spriteLoader("Images/running.png",33,43,6,8);
leftRun = new spriteLoader("Images/leftRunning.png",33,43,6,8);
jump = new spriteLoader("Images/jump.png",32,47,7,2);
leftJump = new spriteLoader("Images/leftJump.png",32,47,7,2);
skeleton_walk = new spriteLoader("Images/skeleton_walk.png",32,43,5,13);
skeleton_attack = new spriteLoader("Images/skeleton_attack.png",53,47,6,13);

/*GLOBAL VARIABLES*/
//avatar and skeleton estimated to be rectangles for height and width calculations
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var platform = 31;
var stop = false; 
var score = 0;
var leftKey = 37, rightKey = 39;
var storeKey = [];
var avatar = {
    width:12, //width of avatar
    height:38, //height of avatar
    x_pos: canvas.width/3,     
    y_pos: canvas.height-platform-40,
    x_spd: 0, //horizontal velocity
    y_spd : 0, //vertical velocity
    limiter : 3.5, //speed limiter
    friction: 0.8, //friction to stop moving on ground
    gravity : 0.5, //gravity in air
    onGround: true,
    runToLeft: false
};
var health=100;
var obstacles = [];
obstacles.push({
    x_pos:canvas.width-11,
    y_pos:canvas.height-platform-60,
    width:10,
    height:35,
    x_spd:1.5
});
obstacles.push({
    x_pos:70,
    y_pos:canvas.height-190,
    width:50,
    height:50,
    x_spd:1.5
});

/* Keyboard Controls */
document.addEventListener("keydown",function(event){
    if(event.keyCode == 32 || event.keyCode == 38){
        startJump();
    }
    storeKey[event.keyCode] = true;
});
document.addEventListener("keyup",function(event){
    if(event.keyCode == 32 || event.keyCode == 38){
        endJump();
    }
    delete storeKey[event.keyCode];
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
    if(storeKey[leftKey]){
        avatar.runToLeft = true;
        if(avatar.x_spd > -avatar.limiter){avatar.x_spd --;}
    }
    if(storeKey[rightKey]){
        avatar.runToLeft = false;
        if(avatar.x_spd < avatar.limiter){avatar.x_spd ++;}
    }
    avatar.x_spd *= avatar.friction;
    avatar.x_pos += avatar.x_spd
    avatar.y_spd += avatar.gravity;
    avatar.y_pos += avatar.y_spd;

    //to prevent going out of screen width
    var maxWidth = canvas.width - avatar.width;
    if(avatar.x_pos >= maxWidth){
        avatar.x_pos = maxWidth;
    }
    if(avatar.x_pos <= 0){
        avatar.x_pos = 0;
    }
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

    //obstacles
    //modify position of obstacle based on its speed
    //<skeleton obstacle>
    obstacles[0].x_pos += obstacles[0].x_spd;
    if(obstacles[0].x_pos < -40||obstacles[0].x_pos >= canvas.width-40){
        //reset the position of the obstacle at the right
        obstacles[0].x_pos = canvas.width-40;
        obstacles[0].x_spd *= -1;
        //console.log("Skeleton speed: " + Math.abs(obstacles[0].x_spd));
    }
    obstacles[1].x_pos += obstacles[1].x_spd;
    if(obstacles[1].x_pos < 0){
        obstacles[1].x_pos = 0;
        obstacles[1].x_spd *= -1
    }
    if(obstacles[1].x_pos >= canvas.width-40){
        obstacles[1].x_pos = canvas.width-40;
        obstacles[1].x_spd *= -1
    } 

    switch(Math.floor(score/10)){
        case 60:
            obstacles[0].x_spd = -1.6
            break;
        case 90:
            obstacles[0].x_spd = -1.8
            break;
        case 120:
            obstacles[0].x_spd = -2.0
            break;
        case 150:
            obstacles[0].x_spd = -2.5
            break;
        case 240:
            obstacles[0].x_spd = -3.0
            break;
        case 360:
            obstacles[0].x_spd = -4.0
            break;
        case 510:
            obstacles[0].x_spd = -6.0
            break;
        case 690:
            obstacles[0].x_spd = -8.0
            break;
        case 900:
            obstacles[0].x_spd = -10.0
            break;
    }
    //update the score
    score++
};

//detect collision and game over
function gameOver(){
    for(var i = 0; i<obstacles.length;i++){
        //case1: avatar right touches obstacle left
        if(((avatar.x_pos + avatar.width) >= obstacles[i].x_pos)
            && //case 2: avatar left touches obstacle right
            (avatar.x_pos <= (obstacles[i].x_pos + obstacles[i].width))
            && //case 3: avatar bottom touch obstacle top
            ((avatar.y_pos + avatar.height) >= obstacles[i].y_pos)
            && //case 4: avatar top touch obstacle bottom
            (avatar.y_pos <= (obstacles[i].y_pos + obstacles[i].height))){
            
            health-=1
            if(health==0){
                //reload page
                //location.reload();
                //stop animation...
                stop = true;
            }
        }
    }
};

//game loop to draw the images on canvas
function render() {
    //update necessary variables

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
            if(avatar.runToLeft == true){
                leftJump.update();
                leftJump.draw(avatar.x_pos,avatar.y_pos);
            }
            else{ 
                jump.update(); 
                jump.draw(avatar.x_pos,avatar.y_pos);
            }
        }
        //if avatar on the ground
        else if(avatar.onGround == true){
            //if avatar is running to the left
            if(avatar.runToLeft == true){
                leftRun.update();
                leftRun.draw(avatar.x_pos,avatar.y_pos);
            }
            else{ 
                run.update(); 
                run.draw(avatar.x_pos,avatar.y_pos);
            }
        } 
        
        //obstacles
        //attack after seeing avatar
        if((avatar.x_pos + avatar.width)+80 >= obstacles[0].x_pos){
            skeleton_attack.update();
            //-20 for x and -5 for y to fix animation difference
            skeleton_attack.draw(obstacles[0].x_pos-20,obstacles[0].y_pos-5);
        }
        else{
            //initial starting out walk
            skeleton_walk.update();
            skeleton_walk.draw(obstacles[0].x_pos,obstacles[0].y_pos); 
        }

        ctx.drawImage(floatEnemy,0,0,513,512,obstacles[1].x_pos,obstacles[1].y_pos,50,50);

        //scoreBoard
        ctx.font = "14px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + Math.floor(score/10),100,50);

        //health bar
        ctx.fillStyle="#FFE4E1";
        ctx.fillRect(avatar.x_pos+5,avatar.y_pos-5,20,5);
        ctx.fillStyle="#FF0000";
        ctx.fillRect(avatar.x_pos+5,avatar.y_pos-5,(health/100)*20,5);       
        ////Whenever you lose health --> health-=1;
    }    
}

/* Game Execution */
//some functionality to identify start of the game

function gameStart(){
    gameOver();
    if(stop==false){ 
        update();
        render();
        //Another way of writing --> window.setTimeout(gameStart, 20);
        requestAnimationFrame(gameStart);
    }      
};

/* Execution */
gameStart();

/*credits
https://arianatheechidna.deviantart.com/art/My-Health-and-Magic-Bars-490743746
io sprites jungle assets
io sprites free platform
*/