var bg, bgImg;
var bottomGround;
var topGround;
var plane, planeImg;
var score = 0;
var WIN = 3
var FORM = 1;
var PLAY = 2;
var END = 0;
var gamestate = FORM;
var flag=false

function preload() {
  bgImg = loadImage("assets/bg.png");

  planeImg = loadImage("assets/plane.png");

  mountainImg = loadImage("assets/Mountain.png");

  startImg = loadImage("assets/start.png");

  boomImg = loadImage("assets/boom.jpg");

  endImg = loadImage("assets/end.png");

  pularSom = loadSound("assets/jump.mp3")

  dieSom = loadSound("assets/die.mp3")

  restartImg = loadImage("assets/restart.png")
}

function setup() {
  createCanvas(400, 400);
  //criando canto superior e inferior
  bottomGround = createSprite(200, 390, 800, 20);
  bottomGround.visible = false;

  topGround = createSprite(200, 10, 800, 20);
  topGround.visible = false;

  //criando o avião
  plane = createSprite(100, 200, 20, 50);
  plane.addImage("plane", planeImg);
  plane.addImage("boom", boomImg);
  plane.scale = 0.13;
  // plane.debug=true
  plane.setCollider("rectangle", 0, 0, 100, 50);

  MountainTopGroup = new Group();
  MountainDownGroup = new Group();
  BarraGroup = new Group();

  start = createSprite(width / 2, width / 2);
  start.addImage(startImg);
  start.scale = 1.5;

  restart = createSprite(width / 2-150, width / 2-150)
  restart.addImage(restartImg)
}

function draw() {
  background("black");

  if (gamestate === FORM) {
    plane.visible = false;
    restart.visible=false;
    if (mousePressedOver(start)) {
      gamestate = PLAY;
      start.visible = false;
      
    }
  }
  if (gamestate === PLAY) {
    image(bgImg, 0, 0, width, height);
    if(mousePressedOver(restart)){
      gamestate = FORM
    }

    plane.visible = true;
    if (keyDown("space")) {
      plane.velocityY = -6;
      
      if(!pularSom.isPlaying()){
        pularSom.play()
        
      }
      
    }

    if (plane.isTouching(BarraGroup)) {
      for (var i = 0; i < BarraGroup.length; i++) {
        BarraGroup[i].destroy();
      }
      score = score + 1;
    }

    if (score === 20) {
      gamestate = WIN;
    }

    //adicionando gravidade
    plane.velocityY = plane.velocityY + 3;

    if (
      MountainTopGroup.isTouching(plane) ||
      MountainDownGroup.isTouching(plane) ||
      plane.isTouching(bottomGround) ||
      plane.isTouching(topGround)
    ) {
      gamestate = END;
    }
   
    spawnMountainTop();
    spawnMountaindown();
    Barra();
    textSize(25);
    fill("blue");
    text("Pontuação: " + score, 225, 50);
  }

  if (gamestate === END) {
    if(!flag && !dieSom.isPlaying()){
      dieSom.play()
      flag=true
    }
    restart.visible=true
   
    image(boomImg, 0, 0, width, height);
    plane.destroy()
    MountainDownGroup.destroyEach()
    MountainTopGroup.destroyEach()
    BarraGroup.setVelocityXEach(0);
    textSize(30);
    fill("red");
    text("Você explodiu!!!!", width/2-100, height/2); 
    
  }

 else if(gamestate === WIN){
    image(endImg, 0, 0, width, height);
    plane.destroy()
    MountainDownGroup.destroyEach()
    MountainTopGroup.destroyEach()
    BarraGroup.setVelocityXEach(0);
    textSize(25);
    fill("white");
    text("Você conseguiu " +score+ " pontos", width/2-150, height/2-50);

  }

  drawSprites();

}


function spawnMountainTop() {
  if (frameCount % 60 === 0) {
    floMountain = createSprite(400, 50, 40, 50);
    floMountain.velocityX = -4;
    floMountain.addImage(mountainImg);
    floMountain.scale = 0.25;
    MountainTopGroup.add(floMountain);
    //floMountain.debug=true
    floMountain.setCollider("rectangle", 0, 0, 900, 660);
  }
}
function spawnMountaindown() {
  if (frameCount % 60 === 0) {
    Mountain = createSprite(400, 400, 40, 50);
    Mountain.velocityX = -4;
    Mountain.addImage(mountainImg);
    Mountain.scale = 0.25;
    Mountain.lifetime = 200;
    Mountain.y = Math.round(random(300, 400));
    Mountain.scale = 0.25;
    MountainDownGroup.add(Mountain);
    Mountain.rotation += 180;
    //Mountain.debug=true
    Mountain.setCollider("rectangle", 0, 0, 900, 660);
  }
}
function Barra() {
  if (frameCount % 60 === 0) {
    barra = createSprite(400, 200, 10, 600);
    barra.velocityX = -4;
    BarraGroup.add(barra);
    barra.visible = false;
  }
}
