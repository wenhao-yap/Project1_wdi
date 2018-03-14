/** Load image resources */
var ground = new Image();
ground.src = "Images/platform2.png";
run = new spriteLoader("Images/running.png",33,43,6,8);
leftRun = new spriteLoader("Images/leftRunning.png",33,43,6,8);
jump = new spriteLoader("Images/jump.png",32,47,7,2);
leftJump = new spriteLoader("Images/leftJump.png",32,47,7,2);

/*GLOBAL VARIABLES*/
//avatar and skeleton estimated to be rectangles for height and width calculations
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var stop = false;
var score = 0;
var leftKey = 37, rightKey = 39, jumpKey = 32;
var storeKey = [];
var avatar = {
    width:12, //width of avatar
    height:38, //height of avatar
    x_pos: 120,     
    y_pos: canvas.height-100,
    x_spd: 0, //horizontal velocity
    y_spd : 0, //vertical velocity
    limiter : 3.5, //speed limiter
    friction: 0.8, //friction to stop moving on ground
    gravity : 0.5, //gravity in air
    runToLeft: false,
    jumping: false, //is the avatar jumping?
    // grounded: false //on the ground
};
var obstacles = [];
obstacles.push({
    x_pos:canvas.width-11,
    y_pos:canvas.height-30,
    width:30,
    height:50,
    x_spd:2.0
})

/* Keyboard Controls */
document.addEventListener("keydown",function(event){
    storeKey[event.keyCode] = true;

});
document.addEventListener("keyup",function(event){
    delete storeKey[event.keyCode];
});

/* GamePlay */
function update(){
    //Update Avatar parameters
    if(storeKey[jumpKey]){
        //can only jump if not jumping
        if(!avatar.jumping){
            //going up
            avatar.y_spd = -8;
            //disallow jumping while already jumping
            avatar.jumping = true;
        }
    }
    if(storeKey[leftKey]){
        avatar.runToLeft = true;
        if(avatar.x_spd > -avatar.limiter){avatar.x_spd --;}
    }
    if(storeKey[rightKey]){
        avatar.runToLeft = false;
        if(avatar.x_spd < avatar.limiter){avatar.x_spd ++;}
    }

    //to prevent sticking to the walls
    avatar.x_spd *= avatar.friction;
    //to prevent sticking to the ceiling
    avatar.y_spd += avatar.gravity;
    avatar.x_pos += avatar.x_spd;
    avatar.y_pos += avatar.y_spd;


    //to prevent going out of screen width
    var maxWidth = canvas.width - avatar.width -10;
    if(avatar.x_pos >= maxWidth){
        avatar.x_pos = maxWidth;
    }
    if(avatar.x_pos <= 0){
        avatar.x_pos = 0;
    }

    //instant death if fall to ground
    //if avatar colliding with ground
    if(avatar.y_pos > canvas.height - avatar.height ){
        avatar.y_pos = canvas.height - avatar.height;
        avatar.y_spd = 0;
        avatar.jumping = false;
    }

    obstacles[0].x_pos += obstacles[0].x_spd;
    if(obstacles[0].x_pos < -40||obstacles[0].x_pos >= canvas.width-40){
        //reset the position of the obstacle at the right
        obstacles[0].x_pos = canvas.width-40;
        obstacles[0].x_spd *= -1;
        console.log("Obstacle speed: " + Math.abs(obstacles[0].x_spd));        
    }

    //obstacles
    for(var i=0; i<obstacles.length;i++){

        //if avatar collide with obstacles
        var dir = collision(avatar,obstacles[i]);
        if(dir == "bottom"){
            avatar.y_spd = 0;
            //allow jumping again
            avatar.jumping = false;
        }
        if(dir == "left"|| dir == "right"){
            avatar.x_spd = 0;
        }
        if(dir == "top"){
            avatar.x_pos = obstacles.x_pos;
            avatar.y_spd = 0 ;
        }
    }
};

function collision(avatar,obstacle){
    //calculate vector from x coordinates
    var vx = (avatar.x_pos + (avatar.width/2)) - (obstacle.x_pos + (obstacle.width/2)); 
    //calculate vector from y coordinates
    var vy = (avatar.y_pos + (avatar.height/2)) - (obstacle.y_pos + (obstacle.height/2));

    //reference point between the two objects
    halfWidth = (avatar.width/2) + (obstacle.width/2);
    halfHeight = (avatar.height/2) + (obstacle.height/2);

    //function will return a string
    var collision = "";

    //check if collision occurs
    if((Math.abs(vx) < halfWidth) && (Math.abs(vy) < halfHeight)){
        //compute offset vector to check which sides it occurs
        var offset_x = halfWidth - Math.abs(vx);
        var offset_y = halfHeight - Math.abs(vy);

        //if offset_x > offset_y means collision occurs either left or right
        //move shape A out of shape B by adjusting with offset
        if(offset_x > offset_y){
            if(vy > 0){
                collision = "top";
                avatar.y_pos += offset_y;
            }
            else{
                collision = "bottom";
                avatar.y_pos -= offset_y;
            }
        }
        else{ //offset x < offset y means collision occurs either top or bottom
            if(vx >0){
                collision = "left";
                avatar.x_pos += offset_x;
            }
            else{
                collision = "right";
                avatar.x_pos -= offset_x;
            }
        }
    }
    return collision;
}

//game loop to draw the images on canvas
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Avatar
    //if avatar not on the ground, trigger jump animation
    if(avatar.jumping == true){
        if(avatar.runToLeft == true){
            leftJump.update();
            leftJump.draw(avatar.x_pos-12,avatar.y_pos);
        }
        else{ 
            jump.update(); 
            jump.draw(avatar.x_pos-15,avatar.y_pos);
        }
    }
    //if avatar on the ground
    else if(avatar.jumping == false){
        //if avatar is running to the left
        if(avatar.runToLeft == true){
            leftRun.update();
            leftRun.draw(avatar.x_pos-15,avatar.y_pos);
        }
        else{ 
            run.update(); 
            run.draw(avatar.x_pos-15,avatar.y_pos);
        }
    } 

    for(var i=0; i<obstacles.length;i++){
        ctx.fillStyle = "black";
        ctx.fillRect(obstacles[i].x_pos,obstacles[i].y_pos,obstacles[i].width,obstacles[i].height);
    } 
}

/* Game Execution */
//some functionality to identify start of the game

function gameStart(){
    if(stop==false){ 
        update();
        render();
        //Another way of writing --> window.setTimeout(gameStart, 20);
        requestAnimationFrame(gameStart);
    }      
};

/* Execution */
gameStart();