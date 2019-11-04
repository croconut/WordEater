// Play state

var Play = function(game) {};
Play.prototype = {
	create: function() {
		// reset barrier speed, level, stop animating, score, current word, reverse
		this.stopAnimating = false;
		barrierSpeed = -250;
		level = 0;
		wordCount = 0;
		curWordLen = 0;
		game.reverse = false;
		//triggers book reset if necessary
		if (game.youAte.length == game.wordsInBook) {
			game.youAte = [];
			game.deaths = 0;
		}
		// setup audio, play bgm
		this.beats = game.add.audio('beats');
		this.eating = game.add.audio('eating');
		this.death = game.add.audio('death');
		this.beats.play('', 0, 0.7, true);	// ('marker', start position, volume (0-1), loop)
		// allow multiple instances of eating to play simultaneously
		this.eating.allowMultiple = true;
		// create scrolling background
		this.bg1 = this.game.add.tileSprite(0, 0, game.width, game.height, 'atlas', 'parallax-space-background.png');
		this.bg2 = this.game.add.tileSprite(0, 0, game.width, game.height, 'atlas', 'parallax-space-stars.png');
		this.bg3 = this.game.add.tileSprite(0, 0, game.width, game.height, 'atlas', 'parallax-space-far-planets.png');
		this.bg5 = game.add.sprite(200, game.height, 'atlas', 'parallax-space-big-planet.png');
		this.bg5.anchor.set(0.5);
		// add eater
		eater = game.add.sprite(game.width/2, game.height-32, 'atlas', '14');
		eater.anchor.set(0.5);
		// add and init eaters animations
		eater.animations.add('walk', Phaser.Animation.generateFrameNames('',14, 17, '', 2), 8, true, false);
		eater.animations.add('death', Phaser.Animation.generateFrameNames('',01, 06, '', 2), 4, false, false);
		eater.animations.add('eat', Phaser.Animation.generateFrameNames('',07, 13, '', 2), 8, false, false);
		eater.animations.play('walk');
		//init our planet background
		game.physics.enable(this.bg5, Phaser.Physics.ARCADE);
		this.bg5.body.velocity.y = 40;
		eater.destroyed = false;	// custom property to track eater life
		// eater physics
		game.physics.enable(eater, Phaser.Physics.ARCADE);
		eater.body.maxVelocity.set(600);
		eater.body.drag.set(200);
		eater.body.collideWorldBounds = true;
		eater.body.bounce.set(0.5);
		eater.body.immovable = true;

		// setup barrier group
		this.barrierGroup = game.add.group();
		this.addBarrier(this.barrierGroup);

		// setup difficulty timer
		this.difficultyTimer = game.time.create(false);	// .create(autoDestroy)
		this.difficultyTimer.loop(1000, this.speedBump, this); // .loop(delay, callback, callbackContext)
		this.difficultyTimer.start();	// don't forget to start the timer!!!!, lol idk why this is here
		//reset our html doc stuff
		document.getElementById('currentWord').innerHTML = 'Eat any word!';
	},
	speedBump: function() {
		// raise barrier speed, increment level
		level++;
		// show timer outside canvas
		
		if(level%5 == 0) {
			// increase audio rate and barriers
			barrierSpeed-= 15; 
			this.beats._sound.playbackRate.value += 0.002;
			

			// change CSS border color
			let color = colors[colorIndex].toString(16);	// get color at index, convert to hex
			if(colorIndex < colors.length-1) {	// increment next index value
				colorIndex++; 
			} else { 
				colorIndex = 0;
			}
			document.getElementById('myGame').style.borderColor = '#' + color;	// change border
			document.getElementById('gameTitle').style.color = '#' + color;	// change title
		}
	},
	update: function() {
		// check for input allowable
		if (this.stopAnimating == false) {
			this.bg1.tilePosition.y += 0.05;
			this.bg2.tilePosition.y += 0.15;
			this.bg3.tilePosition.y += 0.35;
			//move the dude
			if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
				eater.body.velocity.x -= eaterVelocity;
			} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
				eater.body.velocity.x += eaterVelocity;
			}
			else  {
			//instant stops, just cuz
				eater.body.velocity.x = 0;
			}
			// check for collision
			if(!eater.destroyed && !this.barrierGroup.destroyed) {
				game.physics.arcade.overlap(eater, this.barrierGroup, this.eaterCollision, null, this);
			}
			//wrap the big planet (wasnt working well with world wrap, 1600 so that its waaaay bigger than world)
			if (this.bg5.y > 1200) {
				this.bg5.y = -600;
			}
		}
		
	},	
	addBarrier: function(group) {
		// construct new Barrier object, add it to the game world, and add it to the group
		var tintColor = colors[game.rnd.between(0, colors.length-1)]; // grab a random color
		var barrier = new Barrier(game, barrierSpeed, tintColor, 1);
		game.add.existing(barrier);
		group.add(barrier);
	},
	eaterCollision: function(eater, bar) {
		if (bar.word.text == 'REVERSE') {
			// hitting the reverse thing will make the game say reverse
			// idk its kinda cool i guess
			if ('speechSynthesis' in window) {
				// credit : https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API?hl=en
				// Synthesis support. Make your web apps talk!
				var msg = new SpeechSynthesisUtterance(bar.word.text);
				window.speechSynthesis.speak(msg);
			}
			//so it stops processing collisions
			bar.destroyed = true;
			//reverse the size of the words you wanna eat (big or small)
			if (game.reverse) {
				game.reverse = false;
			}
			else {
				game.reverse = true;
			}
			bar.word.kill();
			bar.kill();
		}
		else if ((curWordLen < bar.word.length && !game.reverse) || (curWordLen > bar.word.length && game.reverse)) {
			bar.destroyed = true;
			eater.animations.play('eat');
			game.time.events.add(Phaser.Timer.SECOND, function() {
				eater.animations.play('walk');
			});
			wordCount+= bar.word.length;
			if (game.youAte.length < game.wordsInBook) {
				game.youAte.push(bar.word.text);
			}
			this.eating.play('', 7-(0.15*bar.word.length), 1, false);
			curWordLen = bar.word.length;
			var deathEmitter1 = game.add.emitter(bar.x, bar.y, 200);
			//fixed the colors on the emitter
			deathEmitter1.makeParticles('atlas', 'fragment.png');	
			deathEmitter1.forEach(function(particle) { particle.tint = bar.tint;});
			deathEmitter1.setAlpha(0.5, 1);				// set particle alpha (min, max)
			deathEmitter1.minParticleScale = 0.25;		// set min/max particle size
			deathEmitter1.maxParticleScale = 1;
			deathEmitter1.setYSpeed(-50,500);			// set min/max horizontal speed
			deathEmitter1.setXSpeed(-500,500);			// set min/max vertical speed
			deathEmitter1.start(true, 2000, null, 200);	// (explode, lifespan, freq, quantity)
			bar.word.kill();
			bar.kill();
		}
		else {
			eater.destroyed = true;	// turn off collision checking
			eater.animations.play('death');
			this.difficultyTimer.stop();	// stop timer
			this.beats.fadeOut(500);		// fade music
			this.death.play('', 0, 0.7, false);	// play death knell
			// wanted to remove everything to focus on the death animation
			this.stopAnimating = true;
			eater.body.velocity.x = 0;
			this.barrierGroup.forEach(function(barrier) { barrier.body.velocity.y = 0;});
			this.bg5.body.velocity.y = 0;

		// switch states after timer expires
		// events.add(delay, callback)
		// yeah his code only kinda works, i think it's phasers problem tho personally
		// anyways i put a delay on the word that kills you
			game.time.events.add(Phaser.Timer.SECOND * 2, function() { 
				if ('speechSynthesis' in window) {
					// credit : https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API?hl=en
					// Synthesis support. Make your web apps talk!
					var msg = new SpeechSynthesisUtterance(bar.word.text + 'killed you');
					window.speechSynthesis.speak(msg);
					
					eater.kill();
					game.state.start('GameOver');}});
			//game.time.events.add(Phaser.Timer.SECOND * 2, function() { 
			//	});
		}
		//change all our word stuff, since this is the only time it needs to update
		document.getElementById('gameTitle').innerHTML = 'Word Eater: ' + wordCount + ' letters';
		if (game.reverse) {
			document.getElementById('currentWord').innerHTML = 'Eat words with less than ' + curWordLen + ' letters!';
		}
		else {
			document.getElementById('currentWord').innerHTML = 'Eat words with more than ' + curWordLen + ' letters!';
		}
	}
};