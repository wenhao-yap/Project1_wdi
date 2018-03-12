var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var images = {};

loadImage("idle",".gif");

function loadImage(name,type) {

  images[name] = new Image();
  images[name].onload = function() { 
      resourceLoaded();
  }
  images[name].src = "Images/" + name + type;
}

function resourceLoaded() {

  numResourcesLoaded += 1;
  if(numResourcesLoaded === totalResources) {
    setInterval(redraw, 1000 / fps);
  }
}

var x = canvas.width/2;
var y = canvas.height-30;

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
	ctx.drawImage(images["idle"],x,y);
}

setInterval(draw,10);