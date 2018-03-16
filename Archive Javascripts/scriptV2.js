/*GLOBAL VARIABLES*/
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
//avatar and its specifications
var avatar = {
	width:20, //width of avatar
	height:20, //height of avatar
	x_pos: canvas.width/4, 	//position of x
	y_pos: canvas.height-20, //position of y
	x_spd: 0, //horizontal velocity
	y_spd : 0, //vertical velocity
	limiter : 3.5, //speed limiter
	friction: 0.8, //friction to stop moving on ground
	gravity : 0.5 //gravity in air
}
var controller = {
	left: false,
	right: false,
	jump: false
}; 

/*GAME EXECUTION*/
document.body.addEventListener("keydown",function(event){
	var dwnVal = event.keyCode;
	//console.log("dnwVal: " + dwnVal);
	if(dwnVal == 32 || dwnVal == 38){ //up
		controller.jump = true;
		//console.log("pressJump: " + controller.jump);
	}
	else if(dwnVal == 37){ //moving left will decrease x-coordinates
		controller.left = true;
		//console.log("pressLeft: " + controller.left);
	}
	else if(dwnVal == 39){
		controller.right = true;
		//console.log("pressRight: " + controller.right);
	}
});
document.body.addEventListener("keyup",function(event){
	var upVal = event.keyCode;
	//console.log("upVal: " + upVal);
	if(upVal == 32 || upVal == 38){
		controller.jump = false;
	}
	else if(upVal == 37){ //moving left will decrease x-coordinates
		controller.left = false;
		//console.log("stopLeft: " + controller.left);
	}
	else if(upVal == 39){
		controller.right = false;
		//console.log("stopRight: " + controller.right);
	}
});
window.onload = function(){
	ctx.rect(avatar.x,avatar.y,avatar.width,avatar.height);
	ctx.fillStyle = "black";
	ctx.fill();
	gamePlay();
};

/*MAIN GAMEPLAY*/
function gamePlay(){
	
	if(controller.right == true){
		if(avatar.x_spd < avatar.limiter){
			avatar.x_spd ++;
		}
	}
	if(controller.left == true){
		if(avatar.x_spd > -avatar.limiter){
			avatar.x_spd --;
		}
	}
	if(controller.jump == true){
		avatar.y_spd = -2;
	}

	avatar.x_spd *= avatar.friction;
	avatar.x_pos += avatar.x_spd;
	avatar.y_pos += avatar.y_spd;

	//prevent from going out of screen
	var maxWidth = canvas.width - avatar.width;
	if(avatar.x_pos >= maxWidth){
		avatar.x_pos = maxWidth;
	}
	if(avatar.x_pos <= 0){
		avatar.x_pos = 0;
	}
	if(avatar.y_pos <= 0){
		avatar.y_pos = 0;
	}

	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "black";
	ctx.fillRect(avatar.x_pos,avatar.y_pos,avatar.width,avatar.height);
	requestAnimationFrame(gamePlay);	
};


