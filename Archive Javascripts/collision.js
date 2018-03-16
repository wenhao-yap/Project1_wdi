/*
x coordinates, y coordinates, width, height of both objects
*/
function collision(Ax,Ay,Aw,Ah,Bx,By,Bh,Bw){
	//calculate vector from x coordinates
	var vx = (Ax + (Aw/2)) - (Bx + (Bw/2)); 
	//calculate vector from y coordinates
	var vy = (Ay + (Ah/2)) - (By + (Bh/2));

	//reference point between the two objects
	halfW = (Aw/2) + (Bw/2);
	halfH = (Ah/2) + (Bh/2);

	//function will return a string
	var collision = "";

	//check if collision occurs
	if((Math.abs(vx) < halfW) && (Math.abs(vy) < halfH)){
		//compute offset vector to check which sides it occurs
		var offset_x = halfW - Math.abs(vx);
		var offset_y = halfY - Math.abs(vy);

		//if offset_x > offset_y means collision occurs either left or right
		//move shape A out of shape B by adjusting with offset
		if(offset_x > offset_y){
			if(vy > 0){
				collision = "top";
				Ay += offset_y;
			}
			else{
				collision = "bottom";
				Ay -= offset_y;
			}
		}
		else{ //offset x < offset y means collision occurs either top or bottom
			if(vx >0){
				collision = "left";
				Ax += offset_x;
			}
			else{
				collision = "right";
				Ax -= offset_x;
			}
		}
	}
	return collision;
}