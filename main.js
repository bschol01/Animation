const DOWN = 0;
const UP = 1;
const LEFT = 2;
const RIGHT = 3;
var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Kain(game, spritesheet) {
	this.right = new Animation(spritesheet, 0, 32, 23, 30, .15, 3, true, false);
	this.left = new Animation(spritesheet, 0, 95, 23, 30, .15, 3, true, false);
	this.stopRight = new Animation(spritesheet, 0, 32, 23, 30, .15, 1, true, false);
	this.scale = 2;
	this.x = 0;
	this.y = 250;
	this.speed = 100;
	this.counter = 0;
	this.dir = RIGHT;
	this.game = game;
	this.ctx = game.ctx;
}

Kain.prototype.draw = function (ctx) {
	if (this.x < ctx.canvas.width / 2 - 11.5 && this.dir == RIGHT)
	this.right.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
	else if (this.dir == RIGHT) 
		this.stopRight.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
	else
		this.left.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
}

Kain.prototype.update = function () {
	if (this.x < this.ctx.canvas.width / 2 - 11.5 && this.dir == RIGHT) {
		this.x += this.game.clockTick * this.speed;
	} else this.counter++;
	if (this.counter == 30)
		this.dir = LEFT;
	if (this.dir == LEFT)
		this.x -= this.game.clockTick * this.speed;
}

function Cecil(game, spritesheet) {
	this.left = new Animation(spritesheet, 144, 95, 23, 30, .15, 3, true, false);
	this.stopLeft = new Animation(spritesheet, 144, 95, 23, 30, .15, 1, true, false);
	this.hit = new Animation(spritesheet, 319, 29, 23, 30, .15, 1, true, false);
	this.kneel = new Animation(spritesheet, 292, 0, 23, 30, .15, 1, true, false);
	this.fall = new Animation(spritesheet, 292, 32, 23, 30, .15, 1, true, false);
	this.scale = 2;
	this.x = game.surfaceWidth;
	this.y = 250;
	this.speed = 100;
	this.counter = 0;
	this.dir = RIGHT;
	this.isHit = false;
	this.isKneel = false;
	this.isDown = false;
	this.game = game;
	this.ctx = game.ctx;
}

Cecil.prototype.draw = function (ctx) {
	if (this.x > ctx.canvas.width / 2 + 11.5 && !this.isHit && !this.isKneel && !this.isDown)
	this.left.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
	else if (!this.isHit && !this.isKneel && !this.isDown)
		this.stopLeft.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
	else if (this.isHit)
		this.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
	else if (this.isKneel)
		this.kneel.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
	else if (this.isDown)
		this.fall.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
}

Cecil.prototype.update = function () {
	if (this.x > this.ctx.canvas.width / 2 + 11.5 && !this.isHit && !this.isKneel && !this.isDown) {
		this.x -= this.game.clockTick * this.speed;
	} else this.counter++;
	if (this.counter == 10)	this.isHit = true;
	if (this.isHit) {
		this.x += this.game.clockTick * this.speed;
		//this.counter++;
	}
	if (this.counter == 20) {
		this.isHit = false;
		this.isKneel = true;
	}
	if (this.counter == 30) {
		this.isKneel = false;
		this.isDown = true;
	}
}

AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/BG.jpg");
AM.queueDownload("./img/animals.png");
AM.queueDownload("./img/ffiv.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/BG.jpg")));
	gameEngine.addEntity(new Kain(gameEngine, AM.getAsset("./img/ffiv.png")));
	gameEngine.addEntity(new Cecil(gameEngine, AM.getAsset("./img/ffiv.png")));

    console.log("All Done!");
});