<file: imagelink; is_pattern: check if regular sprites or pattern; ctx: context>
sprite is a constructor object
var Sprite = function(file,is_pattern,ctx){
	//<this: refers to the Sprite object>
	this.image = null;
	//added as canvas process regular sprites and patterns differently
	this.pattern = null;

	//give an error if image link is incorrect
	if(file != undefined && file != "" && file != null){
		this.image = new Image();
		this.image.setAttribute("src",file);

		if(is_pattern==true){
			//specify to repeat pattern
			this.pattern = ctx.createPattern(this.image,"repeat");
		}
	}
	else{
		console.log("Unable to find image.");
	}

	//draw the sprites into canvas
	//< x&y:coordinates; w&h: width and height>
	this.draw = function(x,y,w,h){
		//check if pattern
		if(this.pattern != null){
			//fill context with the pattern and create it
			ctx.fillStyle = this.pattern;
			ctx.fillRect(x,y,w,h);
		}
		else{
			//for original images i.e. if width or height are not defined, use the original dimensions
			if(w != undefined || h != undefined){
				ctx.drawImage(this.image,x,y,this.image.width,this.image.height);
			}
			else{
				//for stretched images
				ctx.drawImage(this.image,x,y,w,h);
			}	
		}
	}
};

$(document).ready(function() {   
    //Initialize canvas
	var canvas = document.querySelector("canvas");
	var ctx = canvas.getContext("2d");

	var tile = "Images/tile.png";
	var pattern = new Sprite(tile,true,ctx);

	setInterval(function(){
		//background color
		ctx.fillStyle="#000000";
		ctx.fillRect=(0,0,800,800);

		pattern.draw(160,160,256,180);

	},25)
	
 });

