// Game Over state

var GameOver = function(game) {};
GameOver.prototype = {
	create: function() {
		// check for high score in local storage
		// i just kept it cuz it's neat
		game.skip = false;
		game.deaths += 1;
		this.barrierGroup = game.add.group();

		if(localStorage.getItem('hiscore') != null) {
			let storedScore = parseInt(localStorage.getItem('hiscore'));
			// see if current play is higher than stored score
			if (wordCount > storedScore) {
				localStorage.setItem('hiscore', wordCount.toString());
				highScore = wordCount;
				newHighScore = true;
			} else {
				highScore = parseInt(localStorage.getItem('hiscore'));
				newHighScore = false;
			}
		// create local storage is none exists
		} else {
			highScore = wordCount;
			localStorage.setItem('hiscore', highScore.toString());
			newHighScore = true;
		}
		//addin the game over text
		var rektText = game.add.text(game.width/2, 40, 'You ate ' + wordCount + ' letters!', {font: 'Courier', fontSize: '48px', fill: '#fff'});
		rektText.anchor.set(0.5);
		var eatenWords;
		//settin up the list of things youve eaten since the browser's been refreshed
		for (var i = 0; i < game.youAte.length; i++) {
		//credit : https://www.paulirish.com/2009/random-hex-color-code-snippets/
		//random colors for the words bars
		//wanted it to look like a graph that gets bigger and smaller, usually it looks cool
			var randHexcode = Math.floor(16777215 * 0.23 + 0.76 * (Math.random()*16777215));
			var barrier = new Phaser.Sprite(game, 18, 67 + (i * 15), 'atlas', 'paddle.png');
			this.barrierGroup.add(barrier);
			//easier without its anchor set there
			//barrier.anchor.set(0.5);
			barrier.tint = randHexcode;
			barrier.scale.x = game.youAte[i].length * 0.06;
			barrier.scale.y = 0.75;
			eatenWords = game.add.text(20, 65 + (i * 15), game.youAte[i], {font: 'Courier', fontSize: '12px', fill: "#000"});
		}
		//let em know if the book got too big and is gonna get deleted
		if (game.youAte.length == game.wordsInBook) {
			var randHexcode = Math.floor(16777215 * 0.23 + 0.76 * (Math.random()*16777215));
			randHexcode = '#' + randHexcode.toString(16);
			var resetBook = game.add.text(180, 160, 'Book completed!\n', {font: 'Courier', fontSize: '32px', fill: randHexcode});
			var resetBook2 = game.add.text(180, 220, 'You died ' + game.deaths + ' times to make it.\nThis book will be overwritten\non your next attempt!', {font: 'Courier', fontSize: '20px', fill: randHexcode});
		}
		else {
			var randHexcode = Math.floor(16777215 * 0.23 + 0.76 * (Math.random()*16777215));
			randHexcode = '#' + randHexcode.toString(16);
			var resetBook = game.add.text(180, 160, 'Book progress made!\nYou\'ve died ' + game.deaths + ' times so far.\nRefreshing will start your book over!', {font: 'Courier', fontSize: '20px', fill: randHexcode})
		}
		var randHexcode = Math.floor(16777215 * 0.23 + 0.76 * (Math.random()*16777215));
		randHexcode = '#' + randHexcode.toString(16);
		var hiScoreText = game.add.text(game.width/2, 80, 'High Score: ' + highScore, {font: 'Courier', fontSize: '32px', fill: randHexcode});
		hiScoreText.anchor.set(0.5);

		var playText = game.add.text(355, game.height/2, 'Press UP ARROW to Restart', {font: 'Courier', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);
		document.getElementById('currentWord').innerHTML = 'Eat any word!';
		//set this variable cuz a few things depend on it
		game.runOnce = false;

	},
	update: function() {
		// wait for keyboard input
		if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
			this.barrierGroup.forEach(function(barrier) {
				barrier.kill();
			}, this, true);
			game.skip = true;
			game.state.start('Play');
		}
		//for some reason i think it works better in update. idk
		//recites all the words youve entered into your book so far
		//restarting the game cancels this
		if ('speechSynthesis' in window && !game.runOnce) {
			game.runOnce = true;
			// credit : https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API?hl=en
			// Synthesis support. Make your web apps talk!
			var mess = new SpeechSynthesisUtterance('You\'ve eaten');
			window.speechSynthesis.speak(mess);
			this.repeater = game.time.create(false);
			this.i = 0;
			this.repeater.repeat(2000, game.youAte.length, function() {
				if (!game.skip) {
					var msg = new SpeechSynthesisUtterance(game.youAte[this.i]);
					window.speechSynthesis.speak(msg);
					this.i++;
				}
				else {
					return;
				}
			}, this);
			this.repeater.start();
		}
	}
};