/** Load image resources */
var dirt = new Image();
dirt.src = "Images/platform4.png";

//player 1 files
p1_idle = new spriteLoader("Images/test/ichigoIdle.png",50,70,8,4);
p1_leftIdle = new spriteLoader("Images/test/ichigoIdleLeft.png",50.1,70,8,4);
p1_run = new spriteLoader("Images/test/ichigoRunRight.png",54.5,70,6,8);
p1_leftRun = new spriteLoader("Images/test/ichigoRunLeft.png",55.1,70,6,8);
p1_jump = new spriteLoader("Images/test/ichigoJump.png",49.4,70,7,9);
p1_leftJump = new spriteLoader("Images/test/ichigoLeftJump.png",50,70,7,9);
p1_attack = new spriteLoader("Images/test/ichigoAttack.png",82,86,7,7);
p1_leftAttack = new spriteLoader("Images/test/ichigoLeftAttack.png",82,86,7,7);
p1_jumpAttack = new spriteLoader("Images/test/ichigoJumpAttack.png",80,90,7,1);
p1_jumpLeftAttack = new spriteLoader("Images/test/ichigoJumpLeftAttack.png",80,90,7,1);

//player2 files
p2_idle = new spriteLoader("Images/idle.png",31,43,6,12);
p2_leftIdle = new spriteLoader("Images/leftIdle.png",31,43,6,12);
p2_run = new spriteLoader("Images/running.png",33,43,6,8);
p2_leftRun = new spriteLoader("Images/leftRunning.png",33,43,6,8);
p2_jump = new spriteLoader("Images/jump.png",32,47,7,2);
p2_leftJump = new spriteLoader("Images/leftJump.png",32,47,7,2);

/*GLOBAL VARIABLES*/
//avatar and skeleton estimated to be rectangles for height and width calculations
var canvas_2 = document.querySelectorAll("canvas")[0];
var ctx_2 = canvas_2.getContext("2d");
var stop_2 = true;
var storeKey_2 = [];
var platform_2 = -20
//player 1
var p1_leftKey = 65, p1_rightKey = 68, p1_jumpKey = 87,  p1_attackKey = 16;
var p1_avatar = {
    width:30, //width of avatar
    height:55,
    x_pos: 10,     
    y_pos: canvas_2.height-120 + platform_2,
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
    width:15, //width of avatar
    height:38, //height of avatar
    x_pos: canvas_2.width-30,     
    y_pos: canvas_2.height-120 + platform_2,
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
var obstacles_2 = [];
obstacles_2.push({
    x_pos:0,
    y_pos:canvas_2.height-30+platform_2,
    width:80,
    height:20
})
obstacles_2.push({
    x_pos:canvas_2.width-80,
    y_pos:canvas_2.height-30+platform_2,
    width:80,
    height:20
})
obstacles_2.push({
    x_pos:10,
    y_pos:canvas_2.height-120+platform_2,
    width:60,
    height:20,
});
obstacles_2.push({
    x_pos:canvas_2.width-60,
    y_pos:canvas_2.height-120+platform_2,
    width:60,
    height:20,   
})
obstacles_2.push({
    x_pos:canvas_2.width/2,
    y_pos:100+platform_2,
    width: 150,
    height:20
})

/* Keyboard Controls */
document.addEventListener("keydown",function(event){
    storeKey_2[event.keyCode] = true;
});
document.addEventListener("keyup",function(event){
    delete storeKey_2[event.keyCode];
});

/* GamePlay */

//generate obstacles_2
//will push into array 10 times
for(var i=80; i<canvas_2.width-100; i+=50){
    obstacles_2.push({
        x_pos:i,
        y_pos:canvas_2.height-30+platform_2,
        width:50,
        height:20
    });
}
//get a random index not including 0 and 1.
while(true){
    var gapNum = (Math.floor(Math.random()*10));
    if(gapNum>4){
        console.log(gapNum);
        obstacles_2.splice(gapNum,1);
        break;
    }
}
//loop through obstacles_2 array avoiding 0 and 1
var k = 0;
while(k<2){
    var randomNum = Math.floor(Math.random()*(obstacles_2.length));
    if(randomNum>4){
        obstacles_2[randomNum].height += 40;
        obstacles_2[randomNum].y_pos -= 40;
        k++;
    }
}

//Update player parameters
function update_2(character,jumpStore,leftStore,rightStore){
    if(storeKey_2[jumpStore]){
        //can only jump if not jumping
        if(!character.jumping){
            //going up
            character.y_spd = -8;
            //disallow jumping while already jumping
            character.jumping = true;
        }
    }
    if(storeKey_2[leftStore]){
        if(character.x_spd > -2){
            character.idleToLeft = true;
            character.x_spd--;
        }
        if(character.x_spd > -5 && character.x_spd < -2){
            character.running = true;
            character.x_spd--;
        }       
    }
    if(storeKey_2[rightStore]){
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
    if(storeKey_2[p1_attackKey]){
        //if character is player 1 then can attack
        if(character == p1_avatar){
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
    var maxWidth = canvas_2.width - character.width;
    if(character.x_pos >= maxWidth){
        character.x_pos = maxWidth;
    }
    if(character.x_pos <= 0){
        character.x_pos = 0;
    }

    //prevent going out of screen height. not possible but precaution
    var ceiling = 30;
    if(character.y_pos <= ceiling){
        character.y_pos = ceiling;
    }

    //instant death if fall to ground
    //if avatar colliding with ground
    if(character.y_pos > canvas_2.height - character.height ){
        character.y_pos = canvas_2.height - character.height;
        character.y_spd = 0;
        character.jumping = false;
        character.health = 0;
    }

    //collision with obstacles_2
    for(var i=0; i<obstacles_2.length;i++){
        //if avatar collide with obstacles_2
        var dir = collision(character,obstacles_2[i]);
        if(dir == "bottom"){
            character.y_spd = 0;
            //allow jumping again
            character.jumping = false;
        }
        if(dir == "left"|| dir == "right"){
            character.x_spd = 0;
        }
        if(dir == "top"){
            character.y_pos = obstacles_2[i].y_pos - character.height;
            character.y_spd = 0;
        }
    }

    var collP2 = collision(p1_avatar,p2_avatar);
    if(collP2 == "bottom"){
        p1_avatar.y_spd = 0;
        //allow jumping again
        p1_avatar.jumping = false;
        if(p1_avatar.attacking == true){
            p2_avatar.health -= 1;
            console.log("test");
            console.log(p2_avatar.health);
        }
    }
    if(collP2 == "left"|| collP2 == "right"){
        p1_avatar.x_spd = 0;
        if(p1_avatar.attacking == true){
            p2_avatar.health -= 1;
            console.log(p2_avatar.health);
        }
    }
    if(collP2 == "top"){
        p1_avatar.x_pos = p2_avatar.x_pos;
        p1_avatar.y_spd = 0;
        if(p1_avatar.attacking == true){
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
function render_2() {
    ctx.clearRect(0, 0, canvas_2.width, canvas_2.height);

    //< Player 1 > 
    //if avatar not on the ground, trigger jump animation
    if(p1_avatar.jumping == true){
        if(p1_avatar.idleToLeft == true){
            if(p1_avatar.attacking == true){
                p1_avatar.attacking =false;
                p1_jumpLeftAttack.draw(p1_avatar.x_pos-15,p1_avatar.y_pos);
            }
            else{ 
                p1_leftJump.update();
                p1_leftJump.draw(p1_avatar.x_pos-15,p1_avatar.y_pos);
            }
        }
        else{
            if(p1_avatar.attacking == true){
                p1_avatar.attacking = false;
                p1_jumpAttack.draw(p1_avatar.x_pos-15,p1_avatar.y_pos);
            }
            else{ 
                p1_jump.update(); 
                p1_jump.draw(p1_avatar.x_pos-15,p1_avatar.y_pos);
            }
        }
    }
    //if avatar on the ground
    else if(p1_avatar.jumping == false){
        if(p1_avatar.idleToLeft == true){
            if(p1_avatar.attacking == true){
                p1_avatar.attacking = false;
                //hard to move when attacking. Prevent holding A all the way
                p1_avatar.x_spd*0.5;
                p1_leftAttack.draw(p1_avatar.x_pos-40,p1_avatar.y_pos-25);
            }
            else{ 
                if(p1_avatar.running == false){ 
                    p1_leftIdle.update(); 
                    p1_leftIdle.draw(p1_avatar.x_pos-15,p1_avatar.y_pos);
                }
                if(p1_avatar.running == true){
                    p1_avatar.running = false;
                    p1_leftRun.update();
                    p1_leftRun.draw(p1_avatar.x_pos-15,p1_avatar.y_pos);
                }
            }
        }
        if(p1_avatar.idleToLeft == false){
            if(p1_avatar.attacking == true){
                p1_avatar.attacking = false;
                //hard to move when attacking
                p1_avatar.x_spd*0.5;
                p1_attack.draw(p1_avatar.x_pos-15,p1_avatar.y_pos-25);
            }
            else{
                if(p1_avatar.running == false){ 
                    p1_idle.update(); 
                    p1_idle.draw(p1_avatar.x_pos-15,p1_avatar.y_pos);
                }
                if(p1_avatar.running == true){
                    p1_avatar.running = false;
                    p1_run.update();
                    p1_run.draw(p1_avatar.x_pos-15,p1_avatar.y_pos);
                }
            }   
        } 
    }
    if(p1_avatar.idleToLeft == true ){
        ctx_2.fillStyle="#FFE4E1";
        ctx_2.fillRect(p1_avatar.x_pos,p1_avatar.y_pos-5,20,5);
        ctx_2.fillStyle="#FF0000";
        ctx_2.fillRect(p1_avatar.x_pos,p1_avatar.y_pos-5,(p1_avatar.health/100)*20,5);
    }
   if(p1_avatar.idleToLeft == false){
        ctx_2.fillStyle="#FFE4E1";
        ctx_2.fillRect(p1_avatar.x_pos+4,p1_avatar.y_pos-5,20,5);
        ctx_2.fillStyle="#FF0000";
        ctx_2.fillRect(p1_avatar.x_pos+4,p1_avatar.y_pos-5,(p1_avatar.health/100)*20,5);
    }
    if(p1_avatar.health<=0.2){
            ctx_2.font = "30px Dosis";
            ctx_2.fillStyle = "white";
            ctx_2.fillText("GAME OVER",135,55);
            ctx_2.font = "20px Dosis";
            ctx_2.fillText("Back to menu in 5s ...",175,55+20)
            p1_avatar.health=0;
            setTimeout(function(){ 
                location.reload()
            }, 5000);
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
        ctx_2.fillStyle="#FFE4E1";
        ctx_2.fillRect(p2_avatar.x_pos,p2_avatar.y_pos-5,20,5);
        ctx_2.fillStyle="#FF0000";
        ctx_2.fillRect(p2_avatar.x_pos,p2_avatar.y_pos-5,(p2_avatar.health/100)*20,5);
    }
   if(p2_avatar.idleToLeft == false){
        ctx_2.fillStyle="#FFE4E1";
        ctx_2.fillRect(p2_avatar.x_pos-10,p2_avatar.y_pos-5,20,5);
        ctx_2.fillStyle="#FF0000";
        ctx_2.fillRect(p2_avatar.x_pos-10,p2_avatar.y_pos-5,(p2_avatar.health/100)*20,5);
    }
    if(p2_avatar.health<= 0.2){
            ctx_2.font = "30px Dosis";
            ctx_2.fillStyle = "white";
            ctx_2.fillText("GAME OVER",135,55);
            ctx_2.font = "20px Dosis";
            ctx_2.fillText("Back to menu in 5s ...",175,55+20)
            p2_avatar.health=0;
            setTimeout(function(){ 
                location.reload()
            }, 5000);
    }

    //obstacles_2
    for(var i=0; i<obstacles_2.length;i++){
        //ctx.fillStyle = "black";
        //ctx.fillRect(obstacles_2[i].x_pos,obstacles_2[i].y_pos,obstacles_2[i].width,obstacles_2[i].height);
        ctx_2.drawImage(dirt,obstacles_2[i].x_pos,obstacles_2[i].y_pos,obstacles_2[i].width,obstacles_2[i].height);
    } 
}

/* Game Execution */
function gameStart_2(){
    if(stop_2==false){ 
        //player 1
        update_2(p1_avatar,87,65,68);
        //player 2
        update_2(p2_avatar,38,37,39);
        render_2();
        //Another way of writing --> window.setTimeout(gameStart, 20);
        requestAnimationFrame(gameStart_2);
    }      
};

//Menu display
var menu = document.getElementById("menu");
var buttons = document.querySelectorAll("button");
var doublePlay = document.getElementById("doublePlay");

/* Game Menu */
doublePlay.addEventListener("click",function(){
    menu.style.visibility = "hidden";
    canvas_2.style.visibility = "visible";
    stop_2 = false;
    gameStart_2();
});

