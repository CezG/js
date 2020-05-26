let c = document.createElement("canvas");
let ctx = c.getContext("2d");
c.width = 600;
c.height = 400;

document.body.appendChild(c);


function loop(){
    ctx.fillStyle = "#19f";
    ctx.fillRect(0, 0, c.width, c.height);

    requestAnimationFrame(loop);
}

loop();