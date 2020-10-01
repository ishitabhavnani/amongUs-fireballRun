var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bud , budImage, budL , budLImage;
var ground, backgroundImage , path, invisibleGround;
var deco , decoImage;
var score;
var obstacle,obImage,obstacleGroup;
var invisibleWallLeft, invisibleWallRight;
var gameOver, gameOverImage, restart, restartImage;
var checkPointSound, dieSound;
var redBud , redBudImage;
function preload(){
  
 backgroundImage=loadImage("amo.jpg");
 budImage=loadAnimation("amongUs.png")
 budLImage=loadAnimation("Cyan.png");
 decoImage=loadImage("gameZone.PNG");
 obImage=loadImage("Fireball.png");
 gameOverImage=loadImage("gameOver.png")
 restartImage=loadImage("restart.jpg")
 checkPointSound=loadSound("checkPoint.mp3")
 dieSound=loadSound("die.mp3")
 redBudImage=loadAnimation("Among_Us.png")
  
}

function setup() {
  createCanvas(400, 400);
  
 
  
  bud=createSprite(50,355,20,20)
  bud.addAnimation("running right" ,budImage);
  bud.addAnimation("running left" ,budLImage);
  bud.scale=0.015
  bud.addAnimation("collided" ,redBudImage);
  
  path=createSprite(300,395,1200,50);
  path.shapeColor="cadetBlue"

  invisibleGround = createSprite(200,390,600,10);
  invisibleGround.visible = false;
  
  invisibleWallRight = createSprite(390,390,10,60);
  invisibleWallRight.visible = false;
  
  invisibleWallLeft = createSprite(10,390,10,60);
  invisibleWallLeft.visible = false;
  
  deco=createSprite(200,150,20,20);
  deco.addImage(decoImage);
  deco.scale=0.4
  
  gameOver=createSprite(200,180,20,20);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.3
  
  restart=createSprite(200,250,20,20);
  restart.addImage(restartImage);
  restart.scale=0.25

  bud.depth=path.depth
  path.depth=bud.depth-1
  
  obstacleGroup=createGroup()
  score=0;
  
  
}

function draw() {

  background("black")
   fill("white")
   text("Score: "+ score, 320,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    deco.visible=true;
    path.velocityX = 0
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
   
    //console.log(bud.y)
    //jump when the space key is pressed
    if(keyDown("right_arrow")) {
        bud.x=bud.x+10;
        bud.changeAnimation("running right",  budImage)
    }
    
    if(keyDown("left_arrow")) {
        bud.x=bud.x-10;
        bud.changeAnimation("running left",budLImage)
    }
    
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstacleGroup.isTouching(bud)){
        gameState = END;
        dieSound.play();
    }
      
    
  }
  
  else if  (gameState===END){
    bud.velocityX=0
    obstacleGroup.setVelocityYEach(0)
    obstacleGroup.setLifetimeEach(-1)
    deco.visible=false
    gameOver.visible=true
    restart.visible=true 
    bud.changeAnimation("collided" ,redBudImage);
    bud.scale=0.2;
    if (mousePressedOver(restart)){
    reset();
    }
  }
  
  bud.collide(invisibleGround);
  bud.collide(invisibleWallRight);
  bud.collide(invisibleWallLeft);
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 20 === 0){
  obstacle = createSprite(500,0,10,40);
   obstacle.x=random(10,390);
   obstacle.addImage(obImage);
   obstacle.scale=0.05
   obstacle.velocityY = (4 + score/100);
   obstacle.depth=path.depth;
   path.depth=obstacle.depth-1;
   obstacle.depth=deco.depth;
   deco.depth=obstacle.depth-1;
   obstacle.lifetime=200
  obstacleGroup.add(obstacle)
 }
}

function reset(){
 gameState=PLAY
 score=0
 obstacleGroup.destroyEach();
 bud.changeAnimation("running right", budImage);
  bud.scale=0.015
}