// add renew player from place where player creshed //maybe not
//need to add turbo  //maybe not
// turbo for full rotation above the ground //maybe not
// add flag of start
// add flag of finish 25km
// need to see meters to finish or time
//add best time score
//add start on the ground
// go as far a you can and rotate as many you can
// add flag where last time finished
let soundEngine = new Audio("sounds/harley.mp3");
        

let c = document.createElement("canvas");
let ctx = c.getContext("2d");
c.width = window.innerWidth-20;
c.height = window.innerHeight-20;
document.body.appendChild(c);

let perm = [];

function drawingRandomGround(perm){
    while (perm.length < 255){
        while(perm.includes(val = 2.2*Math.floor(Math.random()*255)));    // drawing random ground, can manipulate hight of the ground
        perm.push(val); 
    }
}
drawingRandomGround(perm);


let lerp = (a,b,t) => a+(b-a) * (1-Math.cos(t*Math.PI))/2;      //antialiasing


let noise = x =>{                                
    x = x * 0.01 % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

let player = new function(){
    this.x = c.width/2;
    this.y =c.height - noise(this.x)*0.5;
    this.ySpeed = 0;        //gravity
    this.rot = 0;
    this.rSpeed = 0;
    this.score = 0;

    this.img = new Image();
    this.img.src = "img/motorbike_racing.png";
    this.draw = function(){
        let p1 = c.height - noise(t + this.x) * 0.25;
        let p2 = c.height - noise(t + 5 + this.x) * 0.25;
        
        let grounded = 0;
        if(p1 - 15 > this.y){
            this.ySpeed += 0.1;                 //gravity
        }else{
           this.ySpeed -= this.y - (p1-14.7);   // reflection effect,  wheel traction, ski jump effect
            this.y = p1 - 15;                   // moving on the ground- stop gravity
            grounded = 1;
        }

        if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
            playing =false;
            this.rSpeed = 5;
            k.ArrowUp = 0;
            speed = 0;     
        }
        
        let angle = Math.atan2((p2-15) - this.y, (this.x +5) - this.x);  //atan2 -> 2-argument arctangent in radians
        this.y += this.ySpeed;                      //falling
        
        if(grounded && playing){
            this.rot -= (this.rot - angle) * 0.5;   //angle of the player moving on the ground
            //this.rSpeed = this. rSpeed - (angle - this.rot);
            this.rSpeed = 0;                        //better for playing
        }
        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.06;     // left and right rotation
        this.rot -= this.rSpeed * 0.05;                        
        if((this.rot > Math.PI) && playing) {
            this.rot = -Math.PI;
            this.score++}       //landing after forward rotation
        if((this.rot < -Math.PI) && playing) {
            this.rot = Math.PI; 
            this.score++}        //landing after backward rotation
        ctx.save();
        ctx.strokeText( ( t / 1000).toFixed(2) + ' km',15,150);     //drawing position
        ctx.strokeText(this.score,15,200);              //drawing score
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -15, -15, 30 , 30);
        ctx.restore();
    }
} 

let t = 0;
let speed = 0;
let playing = true;
let k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};
function loop(){
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
    
    if(speed>0)soundEngine.play();
    if(speed<=0)soundEngine.pause();
    
    t += 7 * speed;             //position   
    ctx.fillStyle = "#19f";     
    ctx.fillRect(0, 0, c.width, c.height); // drawing frame
   
    
    ctx.font = "50pt Calibri";          
    ctx.fillStyle = "gray";            
    ctx.fillText("XMotorbike",15,60);  

    ctx.fillStyle = "#7b441d";          // ground color
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i <  c.width; i++){         //drawing ground
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    }

    ctx.lineTo(c.width, c.height);
    ctx.fill();
    player.draw();
    requestAnimationFrame(loop);
} 
onkeydown = d => k[d.key] = 0.7;        
onkeyup = d => k[d.key] = 0;

loop();
