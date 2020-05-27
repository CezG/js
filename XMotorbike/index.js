
let c = document.createElement("canvas");
let ctx = c.getContext("2d");
c.width = 500;
c.height = 350;
document.body.appendChild(c);

let perm = [];
while (perm.length < 255){
    while(perm.includes(val = Math.floor(Math.random()*255)));    // drawing random ground
    perm.push(val); 
}

let lerp = (a,b,t) => a+(b-a) * (1-Math.cos(t*Math.PI))/2;

let noise = x =>{
    x = x * 0.01 % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

let player = new function(){
    this.x = c.width/2;
    this.y = 0;
    this.ySpeed = 0;        //gravity
    this.rot = 0;
    this.rSpeed = 0;

    this.img = new Image();
    this.img.src = "motorbike_racing.png";
    this.draw = function(){
        let p1 = c.height - noise(t + this.x) * 0.25;
        let p2 = c.height - noise(t + 5 + this.x) * 0.25;
        
        let grounded = 0;
        if(p1 -15 > this.y){
            this.ySpeed += 0.1;         //gravity
        }else{
            this.y = p1 - 15;           // moving on the ground- stop gravity
            //this.ySpeed = 0;          // free fall
            this.ySpeed -= this.y - (p1-15); // reflection effect,  wheel traction
            grounded = 1;
        }
        let angle = Math.atan2((p2-15) - this.y, (this.x +5) - this.x);  //atan2 -> 2-argument arctangent in radians
        this.y += this.ySpeed;          //falling
        
        if(grounded){
            this.rot -= (this.rot - angle) * 0.5;
            this.rSpeed = this. rSpeed - (angle - this.rot);
        }
        this.rot -= this.rSpeed * 0.1;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -15, -15, 30 , 30);
        ctx.restore();
    }
} 

let t = 0;
function loop(){
    t += 5;             //time
    ctx.fillStyle = "#19f";     
    ctx.fillRect(0, 0, c.width, c.height); // drawing frame

    ctx.fillStyle = "black";
    ctx.beginPath();
   ctx.moveTo(0, c.height);
    for (let i = 0; i <  c.width; i++){
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    }

    ctx.lineTo(c.width, c.height);
    ctx.fill();
    player.draw();
    requestAnimationFrame(loop);
} 

loop();