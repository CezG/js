let canvas = document.createElement("canvas");
let context = c.getContext("2d");
canvas.width = 500;
canvas.height = 350;

document.body.appendChild(c);

let perm = [];
while (perm.length < 255){
    while(perm.includes(val = Math.floor(Math.random()*255)))
    perm.push(val); 
}

let lerp = (a,b,t) => a+ (b-a)*t;
let noise = x =>{
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}


function loop(){
    context.fillStyle = "#19f";     
    context.fillRect(0, 0, canvas.width, canvas.height); // rysowanie 

    context.fillStyle = "black";
    context.beginPath();
    for (let i = 0; i <canvas.width; i++){
        context.lineTo(i,noise(i));


    }
    context.fill();
    requestAnimationFrame(loop);
}

loop();