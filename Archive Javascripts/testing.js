/*GLOBAL VARIABLES*/
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var platform = 31;
var avatar = { 
    width:10, //width of avatar
    height:12, //height of avatar
    x_pos: canvas.width/4-platform,     //position of x
    y_pos: canvas.height-10-platform, //position of y
    x_spd: 0, //horizontal velocity
    y_spd : 0, //vertical velocity
    limiter : 3.5, //speed limiter
    friction: 0.8, //friction to stop moving on ground
    gravity : 0.5, //gravity in air
    onGround: true
}
var obstacles = [];
obstacles.push({
    x_pos:canvas.width-11,
    y_pos:canvas.height-platform-30,
    width:10,
    height:30,
    x_spd:2.0
})


function gameStart(){
    //load sprites
    // spriteLoader(path,frameWidth,frameHeight,margin,fps,endFrame)
    skeleton_walk = new spriteLoader("Images/skeleton_walk.png",32,43,5,13);
    skeleton_attack = new spriteLoader("Images/skeleton_attack.png",53,47,6,13);
    run = new spriteLoader("Images/running.png",31,43,6,8);
    //game loop to draw the images on canvas
    render();
}


/* GamePlay */

//game loop to draw the images on canvas
function render() {
    //update necessary variables
    //update();
    requestAnimationFrame(render);

    //drawing here
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.moveTo(0,50);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.lineTo(canvas.width,50);
    ctx.stroke();

    //Avatar
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    //add 0.5 as a quickfix to make it less blurry
    // ctx.strokeRect(90,50,avatar.width,avatar.height);
    ctx.strokeRect(80,50,12,38);
        run.update();
    run.draw(80,50)

    //Obstacles
    ctx.fillStyle = "red";
    ctx.fillRect(40,50,10,35); 
        skeleton_walk.update();
    skeleton_walk.draw(40,50); 
    // skeleton_attack.update();
    // skeleton_attack.draw(40,6);  
}

/* Game Execution */
//some functionality to identify start of the game
gameStart();