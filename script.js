var grav = 3;
var obstacles = [];

window.onload = function() {
    obstacles = [
        [document.getElementById("obstacle-1"), 10, 60],
        [document.getElementById("obstacle-2"), -20, 60],
        [document.getElementById("obstacle-3"), 60, 60]
    ]
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function spawnBall(event){
    var ball = document.createElement("div");
    ball.style.position = "absolute";
    ball.style.zIndex = "99";
    ball.style.top = (event.clientY - 15) + "px";
    ball.style.left = (event.clientX - 15) + "px";
    ball.style.height = "30px";
    ball.style.width = "30px";
    ball.style.borderRadius = "15px";
    ball.style.backgroundColor = "red";
    document.getElementById("body").appendChild(ball);
    simulateBall(ball);
}

async function simulateBall(ball) {
    var hAcc = -10, wAcc = 0, bounce = 20, maxAcc = 50, top = Number(ball.style.top.substring(0, ball.style.top.length - 2)), left = Number(ball.style.left.substring(0, ball.style.left.length - 2)); //base stats
    while (top < window.innerHeight) {
        //do simulation until window border is reached
        if(obstacleOverlap(ball)){
            var obs = obstacleOverlap(ball);
            var distance = false;
            if (obs[1] > 0) {
                //positive angle
                distance = getDistanceToBlock([obs[0].getBoundingClientRect().left, obs[0].getBoundingClientRect().top, obs[0].getBoundingClientRect().right, obs[0].getBoundingClientRect().bottom], obs[2]/2, [left + 15, top + 15]);
            } else {
                //negative angle
                distance = getDistanceToBlock([obs[0].getBoundingClientRect().left, obs[0].getBoundingClientRect().bottom, obs[0].getBoundingClientRect().right, obs[0].getBoundingClientRect().top], obs[2]/2, [left + 15, top + 15]);
            }
            if (distance < 10) {
                //spawnBallTemp(top + 15, left + 15);
                //calculate vector
                var v = Math.sqrt(hAcc * hAcc + wAcc * wAcc);
                var a = toDegrees(Math.asin(wAcc/v));
                a += 2 * obs[1];
                v -= bounce;
                wAcc = (-1) * v * Math.sin(toRadians(a));
                hAcc = v * Math.cos(toRadians(a));
            }
        }
        top += hAcc;
        left += wAcc;
        hAcc = Math.min(maxAcc, hAcc + grav);
        ball.style.top = top + "px";
        ball.style.left = left + "px";
        await sleep(1000/60);
    }
    ball.remove();
    console.log("done");
}

function obstacleOverlap(ball) {
    for (var i = 0; i < obstacles.length; i++) {
        if (elementsOverlap(ball, obstacles[i][0])) {
            return obstacles[i];
        }
    }
    return false;
}

function elementsOverlap(el1, el2) {
    const domRect1 = el1.getBoundingClientRect();
    const domRect2 = el2.getBoundingClientRect();
    return !(
      domRect1.top > domRect2.bottom ||
      domRect1.right < domRect2.left ||
      domRect1.bottom < domRect2.top ||
      domRect1.left > domRect2.right
    );
}

function spawnBallTemp(top, left){
    var ball = document.createElement("div");
    ball.style.position = "absolute";
    ball.style.zIndex = "199";
    ball.style.top = (top - 5) + "px";
    ball.style.left = (left - 5) + "px";
    ball.style.height = "10px";
    ball.style.width = "10px";
    ball.style.borderRadius = "5px";
    ball.style.backgroundColor = "blue";
    document.getElementById("body").appendChild(ball);
}

function getDistanceToBlock(block, height, ball) {
    var x1 = block[0], y1 = block[1], x2 = block[2], y2 = block[3], x0 = ball[0], y0 = ball[1];
    const d1 = Math.abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1));
    const d2 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    return d1 / d2 - height;
}

function toDegrees (angle) {
    return angle * (180 / Math.PI);
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}