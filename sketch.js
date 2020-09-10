var PLAY = 1;
var END = 0;
var gameState = PLAY;

var jump,die,checkpoint;

//create variables for sprites and images
var trex,runningtrex,deadtrex;
var ground,invisground,groundimage;
var cloudimage,cloudsGroup;
var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var gameover,restart,gameoverimage,restartimage;
var score = 0;
var bg;

localStorage["HighestScore"] = 0;

function preload() {
  //load all images to appropriate variables
  runningtrex = loadAnimation("trex1.png","trex3.png","trex4.png");
  deadtrex = loadAnimation("trex_collided.png");
  groundimage = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  cloudimage = loadImage("cloud.png");
  restartimage = loadImage("restart.png");
  gameoverimage = loadImage("gameOver.png");
  bg = loadImage("bg.jpg");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
}
function setup() {
  createCanvas(600,200);
  //create trex sprite, add animation
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running",runningtrex);
  trex.addAnimation("collided",deadtrex);
  camera.position.x = trex.x;
  camera.position.y = 100;
  trex.scale = 0.5;
  //create ground sprite,add image and velocity
  ground = createSprite(0,180,600,20);
  ground.addImage(groundimage);
  ground.x = ground.width/2;
  ground.velocityX = -6;
  //create invisible ground and disable visibility
  invisiground = createSprite(200,190,600,10);
  invisiground.visible = false;
  //create gameover and restart sprites
  gameover = createSprite(100,100);
  gameover.addImage(gameoverimage);
  gameover.scale = 0.5;
  restart = createSprite(100,140);
  restart.addImage(restartimage);
  restart.scale = 0.5;
  //make gameover and restart invisible
  gameover.visible = false;
  restart.visible = false;
  //create groups for clouds and obstacles
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  textSize(15);
  stroke("black");
}

function draw() {
  background(bg);
  text("Score : "+score,200,50);
  
  if(gameState == PLAY) {
    
    score = score+Math.round(getFrameRate()/60);
    if(score>0 && score%100 == 0) {
     checkpoint.play(); 
    }
    
    ground.velocityX = -(6+3*score/100);
    
    //make the trex jump
    if(keyDown("space") && (trex.y>= 159)) {
      jump.play();
      trex.velocityY = -12;
    }
    
    //add gravity
    trex.velocityY += 0.8;
    
    //create infinite ground
    if(ground.x<0) {
      ground.x = ground.width/2;
    }
    
    //spawn obstacles and clouds
    spawnClouds();
    spawnObstacles();

    //end game
    if(obstaclesGroup.isTouching(trex)) {
      die.play();
     gameState = END;
    }
  }
  else if(gameState == END) {
  
    //show gameover and restart button
    gameover.visible = true;
    restart.visible = true;
    
    //set velocitys to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    
    //change animation to dead trex
    trex.changeAnimation("collided",deadtrex);
    //stop obstacles and clouds from disappearing
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
     reset(); 
    }
  }
  //make the trex walk on the ground
  trex.collide(invisiground);
  drawSprites();
}
function spawnClouds() {
  //display clouds intermitine clouds
   if(frameCount%60 == 0) {
     //create clouds and assign random Y position
      var cloud = createSprite(600,120,40,10);
     cloud.y = Math.round(random(80,120));
     //add animation and scale and velocity
     cloud.addImage(cloudimage);
     cloud.scale = 0.5;
     cloud.velocityX = -4;
     //set lifetime
     cloud.lifetime = 200;
     //move trex to the front
     cloud.depth = trex.depth;
     trex.depth = trex.depth+1;
     //add clouds to the group
     cloudsGroup.add(cloud);
   }
}
function spawnObstacles() {
  //display intermitine obstacles
   if(frameCount%60 == 0) {
     //create obstacles
      var obstacle = createSprite(600,165,10,40);
     //obstacles velocity
     obstacle.velocityX = -(6+3*score/100);
     var rand = Math.round(random(1,6));
     //random image for the obstacles
     switch(rand) {
       case 1:obstacle.addImage(obstacle1);
         break;
        case 2:obstacle.addImage(obstacle2);
         break;
       case 3:obstacle.addImage(obstacle3);
         break;
       case 4:obstacle.addImage(obstacle4);
         break;
        case 5:obstacle.addImage(obstacle5);
         break;
        case 6:obstacle.addImage(obstacle6);
         break;
        default:break;
     }
     obstacle.scale = 0.5;
     //obstacles lifetime
     obstacle.lifetime = 200;
     //add obstacles to group
     obstaclesGroup.add(obstacle);
   }
}
function reset() {
 gameState = PLAY;
  gameover.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",runningtrex);
  if(localStorage["HighestScore"] < score) {
     localStorage["HighestScore"] = score; 
  }
  console.log(localStorage["HighestScore"]);
  score = 0;
}