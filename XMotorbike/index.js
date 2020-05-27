
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

let lerp = (a,b,t) => a+ (b-a)*t;

let noise = x =>{
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}


function loop(){
    ctx.fillStyle = "#19f";     
    ctx.fillRect(0, 0, c.width, c.height); // drawing frame

    ctx.fillStyle = "black";
    ctx.beginPath();
    for (let i = 0; i <  c.width; i++){
        ctx.lineTo(i, noise(i));
    }

    
    ctx.fill();
    requestAnimationFrame(loop);
} 

loop();