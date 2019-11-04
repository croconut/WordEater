// Title state
var Title = function(game) {};
Title.prototype = {
	create: function() {
		// add title screen text and init the book, high score and number of player deaths
		game.youAte = [];
		game.deaths = 0;
		game.wordsInBook = 52; //max 52 words can fit in the book
		newHighScore = false;
		var titleText = game.add.text(game.width/2, game.height/3, 'WORD EATER', {font: 'Courier', fontSize: '60px', fill: '#fff'});
		titleText.anchor.set(0.5);
		//includes some instructions and a prompt to go to next
		var instructText = game.add.text(game.width/2, game.height/2 + 48, 'Use the LEFT & RIGHT ARROWS to eat a word\nBIGGER than the last word you ate\n...or die!!\nHit a REVERSE tile and eat SMALLER words instead', {font: 'Courier', fontSize: '20px', fill: '#fff'});
		instructText.anchor.set(0.5);

		var playText = game.add.text(game.width/2, game.height*.8, 'Press UP ARROW to Start', {font: 'Courier', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);
		var credits = game.add.text(15, game.height*.9, 'Game by Matt Stevens\nansimuz.itch.io/space-background - background art\nmibli.itch.io/black-death-star - player art\nfreesound.org/people/knarmahfox/sounds/85026/ - background music', {font: 'italic Courier', fontSize: '16px', fill: '#fff'});
		playText.anchor.set(0.5);
	},
	update: function() {
		// check for UP input
		if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
			game.state.start('Play');
		}
	}
};