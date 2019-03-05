var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 950 },
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
var game = new Phaser.Game(config);
let currStar = "star0"



function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('wall', 'assets/verticalPlatform.png');
    this.load.image('groundPlatform', 'assets/platform1.png');
    this.load.image('star0', 'assets/rupee1.png');
    this.load.image('star1', 'assets/rupee2.png');
    this.load.image('star2', 'assets/rupee3.png');
    this.load.image('star3', 'assets/rupee4.png');
    this.load.image('star4', 'assets/rupee5.png');
    this.load.image('star5', 'assets/rupee6.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 42, frameHeight: 45 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'sky').setScale(1.5);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'groundPlatform').setScale(3).refreshBody();

    //  Now let's create some ledges
    // platforms.create(380, 400, 'ground');
    // platforms.create(200, 250, 'ground');
    // platforms.create(750, 220, 'ground');
    // platforms.create(600, 170, 'ground');
    platforms.create(200, 470, 'ground');
    // platforms.create(250, 473, 'wall');
    platformCreation()

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setSize(22, 22, 24, 34);
    player.setCollideWorldBounds(true);

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
    let randNum=Math.floor(Math.random()*10)+6
    let randX=Math.floor(Math.random()*500)+100
    let randY=Math.floor(Math.random()*-70)+30
    // let randSpace=Math.floor(Math.random()*100)+30
    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis

    stars = this.physics.add.group({
        key: currStar,
        repeat: 9,
        setXY: { x: Math.floor(Math.random()*500)+100, y: 0, stepX: 65, stepY: randY }
    });

    stars.children.iterate(function (child) {
        //  Give each star0 a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.4));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, `Bomb, null, this);
}


let currXValue = 130
let currYValue = 470

function platformCreation() {
  // let randPlatformX=Math.floor(Math.random()*800)-30 //*1000 = 100px
  // let randPlatformY=Math.floor(Math.random()*150)+330 //*1000 = 100px

  let rand = Math.floor(Math.random()*10)+1

    if (rand % 2 === 0) {
      currXValue += Math.floor(Math.random()*30)+100 //move right
      currYValue -= Math.floor(Math.random()*50)+20 //move up
    } else {
      currXValue -= 50 //move left
      currYValue += 50 //move down
    }

  platforms.create(currXValue, currYValue, 'ground');
}



function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-130);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(130);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.space.isDown && player.body.touching.down)
    {
        player.setVelocityY(-400);
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
      // stars.children.iterate(function (child) {
      //     //  Give each star0 a slightly different bounce
      //
      //     count+=1
      //     if(count === 7){
      //         child.setTexture("star"+count)
      //     }else {
      //       child.setTexture("star"+count)
      //     }
      //     // debugger;
      //     child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.4));
      //
      // });

        //  A new batch of stars to collect
        // stars.loadTexture("star1", 0);
        count += 1
        stars.children.iterate(function (child) {
          // console.log(stars);
          if(count === 7){
              child.setTexture("star"+count)
          }else {
            child.setTexture("star"+count)
          }
          // debugger;
          child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.4));
            child.enableBody(true, Math.floor(Math.random()*500)+100, 0, true, true);
            initScore+=5;

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 1, 'bomb');
        bomb.setBounce(1);
        // bomb.enableBody();
        bomb.setCircle(6);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 100), 10);
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
}
