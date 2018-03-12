var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

function spriteLoader(path,frameWidth,frameHeight,fps,endFrame){
	//load current image
	var image = new Image();
	var framesPerRow = 0;
	//calculate no. of frames per row
	image.onload = function(){
		framesPerRow = Math.floor(image.width/frameWidth);
	};
	image.src = path;

	//load the next frame
	var currFrame = 0;
	var counter = 0;
	//counter and fps needed to fix fast animations
	this.update = function(){
		if(counter == (fps-1)){
			currFrame = (currFrame+1) % endFrame;
		}
		counter = (counter+1) % fps;
	}
	//x and y are the coordinates to draw
	this.draw = function(x,y){
		//row start from 0 as image render from top left (where the origin is)
		//currRow and currCol to check where the next frame is located
		currRow = Math.floor(currFrame / framesPerRow);
		currCol = Math.floor(currFrame % framesPerRow);

		//documentation followed at mozilla drawImage guide
		//source(actual image) parameters
		var sx = currCol*frameWidth;
		var sy = currRow*frameHeight;
		var sWidth = frameWidth;
		var sHeight = frameHeight;
		//destination(canvas) parameters
		var dx = x;
		var dy = y;
		var dWidth = frameWidth;
		var dHeight = frameHeight;

		//drawImage to canvas
		ctx.drawImage(image,sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight);
	}
};

/*
To call this function:
<values represented are arbitary>

	example = new spriteLoader("example.png",31,42,3,8);
	in the animation loop, call example.update() and example.draw(10,10)
*/


