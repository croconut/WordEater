// Boot state
var Boot = function(game) {};
Boot.prototype = {
	preload: function() {
		//the atlas needs to be loaded here so the loading bar can show
		game.load.atlasJSONHash('atlas', 'assets/img/atlasRunner2.png', 'assets/img/atlasRunner2.json');
	},
	create: function() {
		game.state.start('Load');
	}
};