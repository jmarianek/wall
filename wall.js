/*
 * Wall - extension to Bouncing balls demo (Mozilla OOJS demonstration)
 * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice
 * Extension needs ECMAScript 2015.
 *
 * Inspired by old ZX Spectrum game Wall shipped with computer on tape.
 * Developed by Josef Marianek during lecturing JavaScript programming course.
 * https://marianek.cz
 * 
 * changelog:
 * 2018-01-17 - jmarianek - v1;
 * 
 */




const BRICK_WIDTH = 100;
const BRICK_HEIGHT = 40;
const BRICK_COUNT=50;
const BALLS_COUNT=1;
const BGCOL = "lightgray";


// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;



// function to generate random number
// except 0
function random(min, max) {
    do {
        var num = Math.floor(Math.random() * (max - min)) + min;
    } while (num == 0);
    return num;
}



// define Ball constructor
function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}



// define ball draw method
Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.lineWidth = 0;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};


Ball.prototype.erase = function () {
    ctx.beginPath();
    ctx.fillStyle = BGCOL;
    ctx.lineWidth = 0;
    ctx.arc(this.x - 1, this.y - 1, this.size + 2, 0, 2 * Math.PI);
    ctx.fill();
}


// define ball update method
// return -1 if ball hits bottom border, 1 if all bricks were removed,
// else return 0
Ball.prototype.update = function ()
{
    if (hit_ct == BRICK_COUNT) {
        return 1; // vyhra
    }

    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        return -1;
        //this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;

    return 0;

};



/**
 * Detekce kolize s 1 cihlou.
 * @return Pokud k ni dojde tak ji vrati, jinak vrati null.
 */
Ball.prototype.insideBrick = function ()
{
    for (var i = 0; i < bricks.length; i++) {
        if (bricks[i].removed) {
            continue; // preskocime uz odstranene cihly
        }
        if (this.x >= bricks[i].x - this.size
            && this.x <= bricks[i].x + BRICK_WIDTH + this.size
            && this.y >= bricks[i].y - this.size
            && this.y <= bricks[i].y + BRICK_HEIGHT + this.size) {
            return bricks[i];
        }
    }
    return null;
}






Ball.prototype.insidePad = function ()
{
    if (this.x >= pad.x - this.size
        && this.x <= pad.x + BRICK_WIDTH + this.size
        && this.y >= pad.y - this.size)
    {
        return true;
    }

}




// define ball collision detection
Ball.prototype.collisionDetect = function () {
    /*
    // kolize s jinou kulickou
    for(var j = 0; j < balls.length; j++) {
      if(!(this === balls[j])) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
        }
      }
    }
    */

    // zasah do cihly
    var brick = this.insideBrick();
    if (brick) {
        //alert("brick collision");
        this.velY = -this.velY;
        brick.draw(BGCOL);
        brick.removed = true;
        // bod do score
        hit_ct++;
        document.getElementById("score").value = hit_ct;
    }

    if (this.insidePad()) {
        //alert("pad collision");
        this.velY = -this.velY;
    }

};








/**
 * Trida pro jednu cihlu zdi.
 */
class Brick {
    /**
     * Vytvori cihlu na dane souradnici
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
        this.removed = false;
    }

    /**
     * Vykresleni cihly.
     */
    draw(col) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, BRICK_WIDTH, BRICK_HEIGHT);
        if (col === undefined) {
            ctx.fillStyle = this.color;
        } else {
            ctx.fillStyle = col;
        }

        ctx.fill();
    }


}






/**
 * Trida pro odrazeci podlozku.
 */
class Pad {
    /**
     * Vytvori podlozku na dane souradnici
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }


    /**
     * Vykresleni podlozky.
     */
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, BRICK_WIDTH, 10);
        ctx.fillStyle = "black";
        ctx.fill();
    }


    erase() {
        ctx.beginPath();
        ctx.rect(this.x - 1, this.y - 1, BRICK_WIDTH + 2, 12);
        ctx.fillStyle = BGCOL;
        ctx.fill();
    }

}




// inicializace pozadi
ctx.fillStyle = BGCOL;
ctx.fillRect(0,0,width,height);



// define array to store balls
var balls = [];


// init balls
while (balls.length < BALLS_COUNT) {
    var size = random(10, 20);
    var ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the adge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(height/2 + size, height/2 - size), //random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );
    balls.push(ball);
}




// define array to store bricks
var bricks = [];
// init wall
var x = 0;
var y = 80;
var hit_ct = 0; // pocet zasahu
while (bricks.length < BRICK_COUNT) {
    var brick = new Brick(x, y); // TODO class Brick...
    bricks.push(brick);
    brick.draw();
    if (x + BRICK_WIDTH < canvas.width - BRICK_WIDTH) {
        x = x + BRICK_WIDTH;
    } else {
        x = 0;
        y = y + BRICK_HEIGHT;
    }
}

// init pad
var pad = new Pad(width/2 - BRICK_WIDTH/2, height - 20);
pad.draw();



// handler pro udalosti mysi - posun podlozky
function movePad(event)
{
    var x = event.clientX;
    var y = event.clientY; 
    //alert(x);
    pad.erase();
    pad.x = x;
    pad.draw();
}



// define loop that keeps drawing the scene constantly
function loop()
{
    for (var i = 0; i < balls.length; i++) {
        balls[i].erase();
        var retc = balls[i].update()
        if (retc < 0) {
            alert("Game over.");
            location.reload();
            return; 
        } else if (retc > 0) {
            alert("You win!");
            location.reload();
            return;         
        }
        balls[i].collisionDetect();
        balls[i].draw();
    }

    requestAnimationFrame(loop); // obdoba setTimeout(), ale pro animace lepsi
}




// start looping
loop();

