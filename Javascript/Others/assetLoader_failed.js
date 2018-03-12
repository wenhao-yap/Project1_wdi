	//creating canvas
var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");

//var player = {};
//var ground = [];
//var platformWidth = 32;
//var platformHeight = canvas.height - platformWidth * 4;  

//Paul Irish’s request animation polyfill 
var requestAnimFrame = (function(){
  return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback, element){window.setTimeout(callback, 1000 / 60);};
})();

/* ResourceLoader */
var resourceLoader = new function() {
	this.images = {
		"avatar": "Images/avatar.png",
		"ground": "Images/ground.png"
	}
	console.log(this.images);

	for(var name in this.images){
		loadImage(name,this.images.name);
	}

	function loadImage(name,link){
		name = new Image();
		name.onload = function(){
			resourceLoaded();
		}
		name.src = link;
	}

	var totalResources = 2;
	var numResourcesLoaded = 0;
	function resourceLoaded() {
		numResourcesLoaded ++;
	    if(numResourcesLoaded === totalResources) {
	    	return true;
	  	}
	}
};

//eg. call avatar as resourceLoader.images.avatar

//startGame if all resources loaded
if(resourceLoader==true){
 	startGame();
}   	





