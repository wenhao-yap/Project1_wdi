/*GLOBAL VARIABLES*/
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var platform = 25; //platform height
var avatar = { 
	width:10, //width of avatar
	height:12, //height of avatar
	x_pos: canvas.width/4-platform, 	//position of x
	y_pos: canvas.height-10-platform, //position of y
	x_spd: 0, //horizontal velocity
	y_spd : 0, //vertical velocity
	limiter : 3.5, //speed limiter
	friction: 0.8, //friction to stop moving on ground
	gravity : 0.5, //gravity in air
	onGround: true
}
var leftKey = 37, rightKey = 39;
var storeKey = [];
var obstacles = [];
var score = 0;

obstacles.push({
 	x_pos:canvas.width-11,
	y_pos:canvas.height-platform-30,
 	width:10,
 	height:30,
 	x_spd:2.0
})

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
	}
};

/* Gameplay 
Update the necessary variables, render the graphics and put into loop
*/
function update(){
	//Update Avatar parameters
	if(storeKey[leftKey]){
		if(avatar.x_spd > -avatar.limiter){avatar.x_spd --;}
	}
	if(storeKey[rightKey]){
		if(avatar.x_spd < avatar.limiter){avatar.x_spd ++;}
	}

	avatar.x_spd *= avatar.friction;
	avatar.y_spd += avatar.gravity;
	avatar.x_pos += avatar.x_spd;
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
	if(avatar.y_pos > canvas.height-avatar.height-platform)
    {
        avatar.y_pos = canvas.height-avatar.height-platform;
        avatar.y_spd = 0;
        avatar.onGround = true;
    }
    //prevent going out of screen height. not possible but precaution
    var ceiling = 0;
    if(avatar.y_pos <= ceiling){
    	avatar.y_pos = ceiling;
    }

    //Update obstacle parameters
    //changes speed of obstacles depending on the score
	switch(Math.floor(score/5)){
		case 75:
			obstacles[0].x_spd = -2.5
			break;
		case 140:
			obstacles[0].x_spd = -3.0
			break;
		case 200:
			obstacles[0].x_spd = -3.5
			break;
		case 250:
			obstacles[0].x_spd = -4.0
			break;
		case 400:
			obstacles[0].x_spd = -5.0
			break;
		case 600:
			obstacles[0].x_spd = -6.0
			break;
		case 800:
			obstacles[0].x_spd = -7.0
			break;
		case 1200:
			obstacles[0].x_spd = -8.0
			break;
		case 1500:
			obstacles[0].x_spd = -9.0
			break;
		case 2000:
			obstacles[0].x_spd = -10.0
			break;
	}
	//modify position of obstacle based on its speed
    obstacles[0].x_pos += obstacles[0].x_spd;
    //x_pos of obstacles determine the waitin time for it to appear
    if(obstacles[0].x_pos < -40||obstacles[0].x_pos >= canvas.width-40){
        if(obstacles[0].x_pos < -40){
	        //reset to default values of obstacles
	        obstacles[0].height = 30;
	        obstacles[0].y_pos = canvas.height-platform-30;
	         //randomise height of obstacles
	        var addRandom = Math.floor(Math.random()*15);
	        obstacles[0].height += addRandom;
	        obstacles[0].y_pos -= addRandom;
	        //upon reaching a certain score, height further increases
	        if(Math.floor(score/5)>=200){
	        	console.log("Additional difficulty after score 200");
	        	obstacles[0].height += 5;
	        	obstacles[0].y_pos -= 5;
	        }
	        if(Math.floor(score/5)>=500){
	        	console.log("Additional difficulty after score 500");
	        	obstacles[0].height += 5;
	        	obstacles[0].y_pos -= 5;
	        }
	        console.log("Obstacle height: " + obstacles[0].height);
    	}
    	//reset the position of the obstacle at the right
    	obstacles[0].x_pos = canvas.width-40;
        obstacles[0].x_spd *= -1;
        console.log("Obstacle speed: " + Math.abs(obstacles[0].x_spd));        
	}
};

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

function render(){
	ctx.clearRect(0,0,canvas.width,canvas.height);

	//Platform
	ctx.moveTo(0,canvas.height-platform);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "white";
	ctx.lineTo(canvas.width,canvas.height-platform);
	ctx.stroke();

	//Avatar
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 2;
	//add 0.5 as a quickfix to make it less blurry
	ctx.strokeRect(avatar.x_pos+0.5,avatar.y_pos-3,avatar.width,avatar.height);

	//Obstacles
	ctx.fillStyle = "red";
	ctx.fillRect(obstacles[0].x_pos,obstacles[0].y_pos-1,obstacles[0].width,obstacles[0].height);


	//scoreBoard
	ctx.font = "14px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Score: " + Math.floor(score/5),100,30);
};

function gameStart(){
	gameOver();	
    update();
    render();
    //Another way of writing --> window.setTimeout(gameStart, 20);
    requestAnimationFrame(gameStart);  
};

/* Execution */
gameStart();


