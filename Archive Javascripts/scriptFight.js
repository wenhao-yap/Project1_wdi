//remove to see console.log
//IIFE enclose to prevent variables from being in namespace
(function () {
/** Load image resources */
var ground = new Image();
ground.src = "Images/test/Dirt.png";

//player 1 files
idle = new spriteLoader("Images/test/ichigoIdle.png",50,70,8,4);
leftIdle = new spriteLoader("Images/test/ichigoIdleLeft.png",50.1,70,8,4);
run = new spriteLoader("Images/test/ichigoRunRight.png",54.5,70,6,8);
leftRun = new spriteLoader("Images/test/ichigoRunLeft.png",55.1,70,6,8);
jump = new spriteLoader("Images/test/ichigoJump.png",49.4,70,7,9);
leftJump = new spriteLoader("Images/test/ichigoLeftJump.png",50,70,7,9);
attack = new spriteLoader("Images/test/ichigoAttack.png",82,86,7,7);
leftAttack = new spriteLoader("Images/test/ichigoLeftAttack.png",82,86,7,7);
jumpAttack = new spriteLoader("Images/test/ichigoJumpAttack.png",80,90,7,1);
jumpLeftAttack = new spriteLoader("Images/test/ichigoJumpLeftAttack.png",80,90,7,1);

//player2 files
p2_idle = new spriteLoader("Images/idle.png",31,43,6,12);
p2_leftIdle = new spriteLoader("Images/leftIdle.png",31,43,6,12);
p2_run = new spriteLoader("Images/running.png",33,43,6,8);
p2_leftRun = new spriteLoader("Images/leftRunning.png",33,43,6,8);
p2_jump = new spriteLoader("Images/jump.png",32,47,7,2);
p2_leftJump = new spriteLoader("Images/leftJump.png",32,47,7,2);

/*GLOBAL VARIABLES*/
//avatar and skeleton estimated to be rectangles for height and width calculations
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var stop = false;
var score = 0;
var storeKey = [];
//player 1
var leftKey = 65, rightKey = 68, jumpKey = 87,  attackKey = 16;
var avatar = {
    width:30, //width of avatar
    height:55,
    x_pos: 30,     
    y_pos: canvas.height-100,
    x_spd: 0, //horizontal velocity
    y_spd : 0, //vertical velocity
    limiter : 7, //speed limiter
    friction: 0.8, //friction to stop moving on ground
    gravity : 0.5, //gravity in air
    idleToLeft: false,
    jumping: false, //is the avatar jumping?
    running: false,
    attacking: false,
    health: 100
};
//player 2
var p2_leftKey = 37, p2_rightKey = 39, p2_jumpKey = 38;
var p2_avatar = {
    width:12, //width of avatar
    height:38, //height of avatar
    x_pos: canvas.width-30,     
    y_pos: canvas.height-100,
    x_spd: 0, //horizontal velocity
    y_spd : 0, //vertical velocity
    limiter : 10, //speed limiter
    friction: 0.8, //friction to stop moving on ground
    gravity : 0.5, //gravity in air --> higher value jump lower
    idleToLeft: true,
    jumping: false,
    runToLeft: false,
    health: 100
}
var obstacles = [];
obstacles.push({
    x_pos:0,
    y_pos:canvas.height-40,
    width:100,
    height:40
})
obstacles.push({
    x_pos:canvas.width-80,
    y_pos:canvas.height-80,
    width:40,
    height:100
})
obstacles.push({
    x_pos:canvas.width-50,
    y_pos:canvas.height-50,
    width:50,
    height:50
})
obstacles.push({
    x_pos:100,
    y_pos:canvas.height-150,
    width:150,
    height:20,
    x_spd:0.4
});
obstacles.push({
    x_pos:0,
    y_pos:100,
    width:150,
    height:20
})
obstacles.push({
    x_pos:canvas.width-150,
    y_pos:60,
    width:150,
    height:30
})
obstacles.push({
    x_pos:0,
    y_pos:50,
    width:40,
    height:10,
    x_spd:1.0
})

/* Keyboard Controls */
document.addEventListener("keydown",function(event){
    storeKey[event.keyCode] = true;
});
document.addEventListener("keyup",function(event){
    delete storeKey[event.keyCode];
});

/* GamePlay */

//generate obstacles
//will push into array 10 times
for(var i=100; i<500; i+=50){
    obstacles.push({
        x_pos:i,
        y_pos:canvas.height-50,
        width:50,
        height:50
    });
}
//get a random index not including 0 and 1.
while(true){
    var gapNum = (Math.floor(Math.random()*10));
    if(gapNum>6){
        console.log(gapNum);
        obstacles.splice(gapNum,2);
        break;
    }
}
//loop through obstacles array avoiding 0 and 1
while(true){
    var randomNum = Math.floor(Math.random()*(obstacles.length));
    if(randomNum>6){
        obstacles[randomNum].height += 50;
        obstacles[randomNum].y_pos -= 50;
        break;
    }
}

//Update player parameters
function update(character,jumpStore,leftStore,rightStore){
    if(storeKey[jumpStore]){
        //can only jump if not jumping
        if(!character.jumping){
            //going up
            character.y_spd = -8;
            //disallow jumping while already jumping
            character.jumping = true;
        }
    }
    if(storeKey[leftStore]){
        if(character.x_spd > -2){
            character.idleToLeft = true;
            character.x_spd--;
        }
        if(character.x_spd > -5 && character.x_spd < -2){
            character.running = true;
            character.x_spd--;
        }       
    }
    if(storeKey[rightStore]){
        character.idleToLeft = false;
        if(character.x_spd < 2){
            character.running = false;
            character.x_spd++;
        }
        else if(character.x_spd < 5 && character.x_spd >2){
            character.running = true;
            character.x_spd++
        }
    }
    if(storeKey[attackKey]){
        //if character is player 1 then can attack
        if(character == avatar){
            character.attacking = true;
        }
    }   

    //to prevent sticking to the walls
    character.x_spd *= character.friction;
    //to prevent sticking to the ceiling
    character.y_spd += character.gravity;
    character.x_pos += character.x_spd;
    character.y_pos += character.y_spd;

    //to prevent going out of screen width
    var maxWidth = canvas.width - character.width;
    if(character.x_pos >= maxWidth){
        character.x_pos = maxWidth;
    }
    if(character.x_pos <= 0){
        character.x_pos = 0;
    }

    //instant death if fall to ground
    //if avatar colliding with ground
    if(character.y_pos > canvas.height - character.height ){
        character.y_pos = canvas.height - character.height;
        character.y_spd = 0;
        character.jumping = false;
        character.health = 0;
    }

    //obstacles
    obstacles[3].x_pos += obstacles[3].x_spd;
    if(obstacles[3].x_pos < 0){
        obstacles[3].x_pos = 0;
        obstacles[3].x_spd *= -1;
    }
    if(obstacles[3].x_pos >= canvas.width-obstacles[3].width){
        obstacles[3].x_pos = canvas.width-obstacles[3].width;
        obstacles[3].x_spd *= -1;
    }
    obstacles[6].x_pos += obstacles[6].x_spd;
    if(obstacles[6].x_pos < 0){
        obstacles[6].x_pos = 0;
        obstacles[6].x_spd *= -1;
    }
    if(obstacles[6].x_pos >= canvas.width-200){
        obstacles[6].x_pos = canvas.width-200;
        obstacles[6].x_spd *= -1;
    }
    //collision with obstacles
    for(var i=0; i<obstacles.length;i++){
        //if avatar collide with obstacles
        var dir = collision(character,obstacles[i]);
        if(dir == "bottom"){
            character.y_spd = 0;
            //allow jumping again
            character.jumping = false;
        }
        if(dir == "left"|| dir == "right"){
            character.x_spd = 0;
        }
        if(dir == "top"){
            character.y_spd = 0 ;
        }
    }

    var collP2 = collision(avatar,p2_avatar);
    if(collP2 == "bottom"){
        avatar.y_spd = 0;
        //allow jumping again
        avatar.jumping = false;
        if(avatar.attacking == true){
            p2_avatar.health -= 1;
            console.log("test");
            console.log(p2_avatar.health);
        }
    }
    if(collP2 == "left"|| collP2 == "right"){
        avatar.x_spd = 0;
        if(avatar.attacking == true){
            p2_avatar.health -= 1;
            console.log(p2_avatar.health);
        }
    }
    if(collP2 == "top"){
        avatar.x_pos = p2_avatar.x_pos;
        avatar.y_spd = 0;
        if(avatar.attacking == true){
            p2_avatar.health -= 1;
            console.log(p2_avatar.health);
        }
    }

};

//obstacle can refer to another player as well
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

    //< Player 1 > 
    //if avatar not on the ground, trigger jump animation
    if(avatar.jumping == true){
        if(avatar.idleToLeft == true){
            if(avatar.attacking == true){
                avatar.attacking =false;
                jumpLeftAttack.draw(avatar.x_pos-15,avatar.y_pos);
            }
            else{ 
                leftJump.update();
                leftJump.draw(avatar.x_pos-15,avatar.y_pos);
            }
        }
        else{
            if(avatar.attacking == true){
                avatar.attacking = false;
                jumpAttack.draw(avatar.x_pos-15,avatar.y_pos);
            }
            else{ 
                jump.update(); 
                jump.draw(avatar.x_pos-15,avatar.y_pos);
            }
        }
    }
    //if avatar on the ground
    else if(avatar.jumping == false){
        if(avatar.idleToLeft == true){
            if(avatar.attacking == true){
                avatar.attacking = false;
                //hard to move when attacking. Prevent holding A all the way
                avatar.x_spd*0.5;
                leftAttack.draw(avatar.x_pos-40,avatar.y_pos-25);
            }
            else{ 
                if(avatar.running == false){ 
                    leftIdle.update(); 
                    leftIdle.draw(avatar.x_pos-15,avatar.y_pos);
                }
                if(avatar.running == true){
                    avatar.running = false;
                    leftRun.update();
                    leftRun.draw(avatar.x_pos-15,avatar.y_pos);
                }
            }
        }
        if(avatar.idleToLeft == false){
            if(avatar.attacking == true){
                avatar.attacking = false;
                //hard to move when attacking
                avatar.x_spd*0.5;
                attack.draw(avatar.x_pos-15,avatar.y_pos-25);
            }
            else{
                if(avatar.running == false){ 
                    idle.update(); 
                    idle.draw(avatar.x_pos-15,avatar.y_pos);
                }
                if(avatar.running == true){
                    avatar.running = false;
                    run.update();
                    run.draw(avatar.x_pos-15,avatar.y_pos);
                }
            }   
        } 
    } 

    //< Player 2 >
    if(p2_avatar.jumping == true){
        if(p2_avatar.idleToLeft == true){
            p2_leftJump.update();
            p2_leftJump.draw(p2_avatar.x_pos-5,p2_avatar.y_pos);
        }
        else{ 
            p2_jump.update(); 
            p2_jump.draw(p2_avatar.x_pos-15,p2_avatar.y_pos);
        }
    }
    //if avatar on the ground
    else{
        //if avatar is running to the left
        if(p2_avatar.idleToLeft == true){
            if(p2_avatar.running == false){ 
                p2_leftIdle.update(); 
                p2_leftIdle.draw(p2_avatar.x_pos-5,p2_avatar.y_pos-3);
            }
            if(p2_avatar.running == true){
                p2_avatar.running = false;
                p2_leftRun.update();
                p2_leftRun.draw(p2_avatar.x_pos-5,p2_avatar.y_pos-3);
            }
        }
        else{
            if(p2_avatar.running == false){ 
                p2_idle.update(); 
                p2_idle.draw(p2_avatar.x_pos-15,p2_avatar.y_pos-3);
            }
            if(p2_avatar.running == true){
                p2_avatar.running = false;
                p2_run.update();
                p2_run.draw(p2_avatar.x_pos-15,p2_avatar.y_pos-3);
            }   
        }
    }
    //health bar
    if(p2_avatar.idleToLeft == true){
        ctx.fillStyle="#FFE4E1";
        ctx.fillRect(p2_avatar.x_pos,p2_avatar.y_pos-5,20,5);
        ctx.fillStyle="#FF0000";
        ctx.fillRect(p2_avatar.x_pos,p2_avatar.y_pos-5,(p2_avatar.health/100)*20,5);
    }
   if(p2_avatar.idleToLeft == false){
        ctx.fillStyle="#FFE4E1";
        ctx.fillRect(p2_avatar.x_pos-10,p2_avatar.y_pos-5,20,5);
        ctx.fillStyle="#FF0000";
        ctx.fillRect(p2_avatar.x_pos-10,p2_avatar.y_pos-5,(p2_avatar.health/100)*20,5);
    }
    if(p2_avatar.health<=0.2){
            ctx.font = "50px Arial";
            ctx.fillStyle = "black";
            ctx.fillText("GAME OVER",170,canvas.height/2);
            ctx.font = "20px Arial";
            ctx.fillText("Back to menu in 5s ...",190,canvas.height/2+20)
            p2_avatar.health=0;
            setTimeout(function(){ 
                location.reload()
            }, 5000);
    }

    //obstacles
    for(var i=0; i<obstacles.length;i++){
        //ctx.fillStyle = "black";
        //ctx.fillRect(obstacles[i].x_pos,obstacles[i].y_pos,obstacles[i].width,obstacles[i].height);
        ctx.drawImage(ground,obstacles[i].x_pos,obstacles[i].y_pos,obstacles[i].width,obstacles[i].height);
    } 
}

/* Game Execution */
//some functionality to identify start of the game

function gameStart(){
    if(stop==false){ 
        //player 1
        update(avatar,87,65,68);
        //player 2
        update(p2_avatar,38,37,39);
        render();
        //Another way of writing --> window.setTimeout(gameStart, 20);
        requestAnimationFrame(gameStart);
    }      
};

/* Execution */
window.onload = function(){
    gameStart();
};
})();