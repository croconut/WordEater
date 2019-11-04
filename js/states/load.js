// Load state
var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// setup loading bar
		var loadingBar = this.add.sprite(game.width/2, game.height/2, 'atlas','loading.png');
		loadingBar.anchor.set(0.5);
		game.load.setPreloadSprite(loadingBar);

		// load graphics assets unnecessary due to atlas

		// load audio assets
		game.load.path = 'assets/audio/';
		game.load.audio('beats', ['beats.wav']);
		game.load.audio('eating', ['eating.mp3']);
		game.load.audio('death', ['death.wav']);
	},
	create: function() {
		// check for local storage browser support
		if(window.localStorage) {
			console.log('Local storage supported');
		} else {
			console.log('Local storage not supported');
		}
		// go to Title state
		game.state.start('Title');
	}
};