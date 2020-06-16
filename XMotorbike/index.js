// add flag of start
// add flag of finish 25km
// need to see meters to finish or time
//add best time score
//add start on the ground
// go as far a you can and rotate as many you can
// add flag where last time finished
let soundEngine = new Audio("sounds/harley.mp3");
let deathDance = new Audio("video/coffinDance.mp4");
        
let c = document.createElement("canvas");
let ctx = c.getContext("2d");
c.width = window.innerWidth-20;
c.height = window.innerHeight-20;
document.body.appendChild(c);

let t = 0;
let speed = 0;
let playing = true;
let metersToFinish =2000;  //25500
let k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};

let perm = [];
randomNumbersInArray();



let player = new function(){
    this.x = c.width/2;
    this.y =c.height - noise(this.x)*0.5;
    this.ySpeed = 0;        //gravity
    this.rot = 0;
    this.rSpeed = 0;
    this.score = 0;
    this.img = new Image();
    this.img.src = "img/motorbike_racing.png";
    this.imgFlag = new Image();
    this.imgFlag.src = "img/finish flag.png";
    
    this.draw = function(){
        let grounded = 0;
     
        let p1 = c.height - noise(t + this.x) * 0.25;               //back position
        let p2 = c.height - noise(t + 5 + this.x) * 0.25;           //front position
        
        if(p1 - 15 > this.y){
            this.ySpeed += 0.1;                 //gravity
        }else{
           this.ySpeed -= this.y - (p1-14.7);   // reflection effect,  wheel traction, ski jump effect
            this.y = p1 - 15;                   // moving on the ground- stop gravity
            grounded = 1;
        }
        
        this.y += this.ySpeed;                      //falling
        
        if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
            playing =false;
            this.rSpeed = 5;
            k.ArrowUp = 0;
            speed = 0;
            // zapisz wynik
            // pokaż wynik po paru sekundach i zapytaj czy ponownie zagrać
            
            deathDance.play(); 
        }

        if(grounded && playing){
            this.rot -= (this.rot - angle(p2,this.y,this.x)) * 0.5;   //angle of the player moving on the ground 
            this.rSpeed = 0;                                        //stop rotate
        }
 
        stopMovingBackwardsInAir(grounded, playing, k.ArrowDown);

        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.06;     // left and right rotation

        this.rot -= this.rSpeed * 0.05;                        
        if((this.rot > Math.PI) && playing) {
            this.rot = -Math.PI;
            this.score++}       //landing after forward rotation
        
        if((this.rot < -Math.PI) && playing) {
            this.rot = Math.PI; 
            this.score++}        //landing after backward rotation
            
        ctx.save();
        drawPosition(t);    
        drawFlag(t,this.imgFlag,this.x,c);   
        drawScore(this.score);
        motorbikePosition(this.x, this.y);
        rotateMotorbike(this.rot);
        ctx.drawImage(this.img, -15, -15, 30 , 30);
        ctx.restore();
    }
} 


onkeydown = d => k[d.key] = 0.7;        
onkeyup = d => k[d.key] = 0;
loop();

function loop(){   
    controlSpeed();
    playSaundEngine(speed);
    position();
    backgroundColor("#19f");   
    drawText("XMotorbike","gray","50pt Calibri", 15, 60 );
    drawGround(); 
    player.draw();
    requestAnimationFrame(loop);
    
} 


function controlSpeed(){
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
}

function position(){
    t += 7 * speed;                
}

function playSaundEngine(speed){
    if(speed>0)soundEngine.play();
    if(speed<=0)soundEngine.pause();
}

function stopMovingBackwardsInAir(grounded, playing, k){
    if (!grounded && playing){          
        k.ArrowDown = 0;
    }
}

function backgroundColor(col){
    ctx.fillStyle = col; 
    ctx.fillRect(0, 0, c.width, c.height); // drawing frame    
}

function drawGround(){
    ctx.fillStyle = "#7b441d";          
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i <  c.width; i++){         
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    }

    ctx.lineTo(c.width, c.height);
    ctx.fill();
    
}
function drawFlag(t,imgFlag,x,c){
    y=c.height -34 - noise(x +metersToFinish) * 0.25;
    x=x-t+metersToFinish
    ctx.drawImage(imgFlag, x, y, 30 , 30);
    console.log(x,y);
    console.log(perm);    
}

function drawText(txt,color, font , positionX, positionY){
    ctx.font = font;          
    ctx.fillStyle = color;            
    ctx.fillText(txt, positionX, positionY);  

}

function drawPosition(t){
    ctx.strokeText( ( t / 1000 - metersToFinish/1000).toFixed(2) + ' km',15,150);
}

function drawScore(score){
    ctx.strokeText(score,15,200);
}

function motorbikePosition(x,y){
    ctx.translate(x, y);
}

function rotateMotorbike(rot){
    ctx.rotate(rot);
}
//function roadEnd(positionX)


function randomNumbersInArray(){       // random numbers to determine the hight of the ground
    while (perm.length < 255){
        while(perm.includes(val = 2.2*Math.floor(Math.random()*255)));    
        perm.push(val); 
    }
}

function noise(x){                     //base for the ground                   
    x = x * 0.01 % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

function lerp(a,b,t){           //rectangles            
    return a+(b-a) * antialiasing(t);
}

function antialiasing(t){
    return (1-Math.cos(t*Math.PI))/2
}

function angle(p2,y,x){
    return Math.atan2((p2-15) - y, (x +5) - x);  //atan2 -> 2-argument arctangent in radians
 }