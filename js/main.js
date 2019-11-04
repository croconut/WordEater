//Matthew Stevens
//Word Eater - eat da words
//Game features - cool character eating thingy that I animated, i didnt do the death one tho
//a gigantic dictionary of words
//your browser will say all the words you ate (chrome at least)
//you're making a book! kinda
//CMPM120 5/1/2019

"use strict";
// define globals
var game;
var eater = null;
var eaterVelocity = 150;
var colors = [0x1BE7FF, 0x6EEB83, 0xE4FF1A, 0xE8AA14]; // colors array (rainbows!)
var colorIndex = 0;
var extremeMODE;
var shadowLock = false;
var barrierSpeed;
var level;
var wordCount;
//credit for words.txt : https://github.com/words/an-array-of-english-words
var reader = new FileReader();
var words = wordStr.split(" ");
var highScore;
var newHighScore;

// wait for browser to load before creating Phaser game
window.onload = function() {
	// uncomment the following line if you need to purge local storage data
	// localStorage.clear();
	
	// define game
	game = new Phaser.Game(640,860, Phaser.AUTO, 'myGame');
	
	// define states
	game.state.add('Boot', Boot);
	game.state.add('Load', Load);
	game.state.add('Title', Title);
	game.state.add('Play', Play);
	game.state.add('GameOver', GameOver);
	game.state.start('Boot');
}