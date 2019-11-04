// Barrier prefab
// idk why i kept the name barrier, meh
// create Barrier constructor
var Barrier = function(game, speed, tintColor, scaleMod) {
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	// a long words can actually end up slightly off screen :/, but cant do much about 28 letter words haha
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(90,game.width-90), 0, 'atlas', 'paper.png');
	 // put text on it, if reverse it's white and bolded/italics
	var addedWord;
	if (Math.random() * 15 > 13) {
		addedWord = 'REVERSE';
		this.word = game.add.text(this.x, this.y, addedWord, {font: 'italic bold Courier', fontSize: '20px', fill: '#000000'}); 
		this.scale.y = 2.5 * scaleMod;
		this.tint = 0xffffff;
	}
	else {
		addedWord = words[game.rnd.between(0, words.length-1)];
		this.word = game.add.text(this.x, this.y, addedWord, {font: 'Courier', fontSize: '20px', fill: '#000000'});  
		this.scale.y = 1.5 * scaleMod;
		this.tint = tintColor;
	}
	//init the sprite to proper length, start its falling and start its physics
	this.word.anchor.setTo(0.5, 0.5);
	this.word.length = addedWord.length;
	this.word.text = addedWord;
	this.destroyed = 0;
	game.physics.enable(this, Phaser.Physics.ARCADE);	// enable physics
	this.scale.x = this.word.length * 0.32;
	this.anchor.set(0.5);								// set anchor to center
	this.body.immovable = true;							// make immovable
	this.body.velocity.y = -speed;						// make it go!
	this.newBarrier = true;								// custom property to permit new creation
};

// inherit prototype from Phaser.Sprite and set constructor to Barrier
// the Object.create method creates a new object w/ the specified prototype object and properties
Barrier.prototype = Object.create(Phaser.Sprite.prototype);
// since we used Object.create, we need to explicitly set the constructor
Barrier.prototype.constructor = Barrier;  

// override the Phaser.Sprite update function
Barrier.prototype.update = function() {
	//creates new barriers when it passes a certain point
	if(this.newBarrier && this.y >= game.height/3 && this.body.velocity.y != 0) {
		this.newBarrier = false;
		Play.prototype.addBarrier(this.parent, this.tint);
	}
	// kill it off screen
	if(this.y < -this.height) {
		this.kill();
		this.word.kill();
	}
	// keep the word on top of the sprite
	this.word.x = this.x;
	this.word.y = this.y + 6;
}