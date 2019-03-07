var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var rupee = new Audio();
rupee.src = "http://noproblo.dayjo.org/ZeldaSounds/LOZ/LOZ_Get_Rupee.wav"
var theme;
// theme.src = "sounds/theme.mp3"
var game = new Phaser.Game(config);
let currStar = "star1"


function preload ()
{
    this.load.audio("theme", "sounds/theme.mp3")
    this.load.image('background', 'assets/sceneImages2/background.png');
    this.load.image('ground', 'assets/sceneImages2/platform.png');
    this.load.image('ground1', 'assets/sceneImages2/platform1.png');
    this.load.image('wall', 'assets/verticalPlatform.png');
    this.load.image('groundPlatform', 'assets/sceneImages2/newGround.png');
    this.load.image('star1', 'assets/rupee1.png');
    this.load.image('star2', 'assets/rupee2.png');
    this.load.image('star3', 'assets/rupee3.png');
    this.load.image('star4', 'assets/rupee4.png');
    this.load.image('star5', 'assets/rupee5.png');
    this.load.image('star6', 'assets/rupee6.png');
    this.load.image('bomb', 'assets/sceneImages2/bomb.png');
    this.load.image('bomb2', 'assets/sceneImages2/bomb2.png');
    this.load.image('bomb3', 'assets/sceneImages2/bomb3.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 42, frameHeight: 45 });
}

function create ()
{
    //  A simple background for our game
    // theme = this.add.audio("theme");
    // theme.play();
    this.sound.play('theme')
    this.add.image(400, 400, 'background').setScale(2.3)

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();
    platforms.create(100, 788, 'groundPlatform').setScale(1.8).refreshBody();
    platformCreation()
    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');
    //  Player physics properties. Give the little guy a slight bounce.
    player.setSize(22, 22, 24, 34);
    player.setCollideWorldBounds(true);
    player.setScale(1.5)
    player.body.collideWorldBounds = true;
    bombs = this.physics.add.group();
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 5 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 6, end: 8 }),
        frameRate: 10,
        repeat: -1
    });



    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    let randNum=Math.floor(Math.random()*10)+200
    let randX=Math.floor(Math.random()*500)+100
    let randY=Math.floor(Math.random()*-70)+30
    // let randSpace=Math.floor(Math.random()*100)+30
    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: currStar,
        repeat: 2,
        setXY: { x: Math.floor(Math.random()*50)+400, y: 0, stepX: randNum, stepY: randY }
        // setXY: { x: 25, y: 0, stepX: 65, stepY: randY }
    });
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.7, 0.3));
    });


    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { font: '40px VT323', fill: 'black' });
    //  Collide the player and the rupees with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, bombs);
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    // this.physics.add.overlap(bombs, platforms, killBombs, null, this);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}


let currXValue = 130  //x value (how far right from the canvas)
let currYValue = 720 //y value (how far down from the canvas)
let platformAlgo = 1



function platformCreation() {
  // let randPlatformX=Math.floor(Math.random()*800)-30 //*1000 = 100px
  // let randPlatformY=Math.floor(Math.random()*150)+330 //*1000 = 100px

  // let rand = Math.floor(Math.random()*10)+1
  //   if (rand % 2 === 0 && currYValue >= 520 && currXValue <= 800 ) {
  //     currXValue += Math.floor(Math.random()*30)+100 //move right
  //     currYValue -= Math.floor(Math.random()*50)+20 //move up
  //   } else {
  //     currXValue -= 50 //move left
  //     currYValue += 50 //move down
  //   }
  //
  //   if (platformAlgo % 3 === 0) {
  //     platforms.create(currXValue, currYValue, 'ground1');
  //   } else if (platformAlgo % 2 === 0) {
  //     platforms.create(currXValue, currYValue, 'ground');
  //   }

  if (platformAlgo === 1){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue += 300
    currYValue -= 20
  } else if (platformAlgo === 2){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue += 200
    currYValue -= 50
  } else if (platformAlgo === 3){
    platforms.create(currXValue, currYValue, 'ground');
    currXValue += 150
    currYValue -= 70
  } else if (platformAlgo === 4){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue -= 170
    currYValue -= 60
  } else if (platformAlgo === 5){
    platforms.create(currXValue, currYValue, 'ground');
    currXValue -= 200
    currYValue -= 60
  } else if (platformAlgo === 6){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue -= 240
    currYValue -= 70
  } else if (platformAlgo === 7){
    platforms.create(currXValue, currYValue, 'ground');
    currXValue -= 20
    currYValue += 100
  } else if (platformAlgo === 8){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue += 605
    currYValue -= 80
  } else if (platformAlgo === 9){
    platforms.create(currXValue, currYValue, 'ground');
    currXValue -= 160
    currYValue -= 100
  } else if (platformAlgo === 10){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue -= 150
    currYValue -= 90
  } else if (platformAlgo === 11){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue += 400
    currYValue += 270
  } else if (platformAlgo === 12){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue += 160
    currYValue += 180
  } else if (platformAlgo === 13){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue += 50
    currYValue -= 90
  } else if (platformAlgo === 14){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue += 50
    currYValue -= 190
  } else if (platformAlgo === 15){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue -= 750
    currYValue -= 30
  } else if (platformAlgo === 16){
    platforms.create(currXValue, currYValue, 'ground1');
    currXValue -= 750
    currYValue -= 20
  }

    platformAlgo += 1
}



function update ()
{
    if (gameOver)
    {
        gameOver=false;
        this.scene.restart()
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-170);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(170);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.space.isDown && player.body.touching.down)
    {
        player.setVelocityY(-650);
    }

}

let initScore = 10
let count = 0
function collectStar (player, star0)
{
    rupee.play();
    star0.disableBody(true, true);

    //  Add and update the score
    score += initScore;
    scoreText.setText('Score: ' + score);
      //changing the star's image


    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        // stars.loadTexture("star2", 0);
        count += 1
        stars.children.iterate(function (child) {
          // console.log(stars);
          if(count >= 6){
              child.setTexture("star6")
          }else {
            child.setTexture("star"+count)
          }
          // debugger;
          child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.4));
            child.enableBody(true, Math.floor(Math.random()*500)+100, 0, true, true);
            initScore+=1;
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 1, 'bomb');

         if (count % 4 === 0){
          bomb.setScale(1);
          bomb.setTexture("bomb3");
          bomb.setCollideWorldBounds(false);
          bomb.setBounce(1);
          bomb.setVelocity(Phaser.Math.Between(-100, 100), 10);
          bomb.setCircle(15)
        } else if (count % 3 === 0){
          bomb.setBounce(1);
          bomb.setScale(4);
          bomb.setTexture("bomb2");
          bomb.setCollideWorldBounds(false);
          bomb.setVelocity(Phaser.Math.Between(-300, 300), 100);
          bomb.setCircle(12)
          bomb.setRotation(.7);
        } else {
          bomb.setBounce(1);
          bomb.setScale(1);
          bomb.setCircle(6);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 10);
          bomb.setRotation(.7);
        }
        // bomb.enableBody();
        // bomb.setTint(0xff0000)
        // bomb.destroy();
        bomb.allowGravity = false;
        platformCreation();

    }
}

function hitBomb (player, bomb)
{

    this.physics.pause();
    console.log(score)
    const name=prompt('Name: ')
    console.log(name)
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    game.sound.stopAll();
    score = 0
    initScore = 10
    platformAlgo = 1
    currXValue = 130  //x value (how far right from the canvas)
    currYValue = 720
    count = 0

}

function render() {
    // weapon.debug();
}



//==================//===================//====================
//==================//===================//====================
//==================//===================//====================
//==================//===================//====================
//==================//===================//====================
//==================//===================//====================
//==================//===================//====================
//==================//===================//====================
//==================//===================//====================
//==================//===================//====================
