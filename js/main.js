//ZK App Data
var appData = { 
	title : "WeDefenders",
	level : 1,
	selectedLevel : 1,
	weaponOwned : [1],
	selectedWeapon : 1,
	defRate : 0,
	enmRate : 0,
	score : 100,
	cash : 100,
	noads : false
};

if(localStorage.getItem(appData.title) !== null){
	appData = JSON.parse(localStorage.getItem(appData.title));
}

function saveData(){
	localStorage.setItem(appData.title, JSON.stringify(appData));
}

//SCREEN VARS
var baseWidth = 1280;
var screnRatio = window.innerWidth/window.innerHeight;
var gameHeight = baseWidth/screnRatio;

//PHASER VAR
var game = new Phaser.Game(baseWidth, gameHeight, Phaser.AUTO);

//GAME VARS
var defenders = [];
var defCount;
var enemyCount;
var enemyStrength;
var enemySpeed;
var gameover;
var score;
var scoreText;
var explosions;
var spark;

var ZKGame = {};

var buttonTextStyle = { font : "25px Arial", fill : "white", stroke : "#6f1500", strokeThickness : 3 };
var boldTextStyle = { font : "35px Arial",  fill : "#6f1500", fontWeight : "bold" };
var plainTextStyle = {font: "18px Arial", fill : "#6f1500", fontWeight : "bold", align : "center"};
var brightTextStyle = {font: "18px Arial", fill : "#ff5b35", fontWeight : "bold", align : "right"};

ZKGame.LogoIntro = {
	preload : function(){
		game.load.image("logo", "assets/zkcs.png");
	},
	create : function(){
		game.stage.backgroundColor = "#ffffff";
		game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		var zkLogo = game.add.sprite(game.world.centerX, game.world.centerY, "logo");
		zkLogo.anchor.setTo(.5, .5);
		game.camera.flash(0x000000, 1000);
		setTimeout(function(){
			game.state.start("MainMenu");
		}, 4000);
	}
}

ZKGame.MainMenu = {
	preload : function(){
		if(banner != null) 
			if(!appData.noads) banner.show();
		game.load.image("wed", "assets/wed.png");
		game.load.image("button", "assets/button.png");
		game.load.image("throphy", "assets/throphy.png");
		game.load.image("floor", "assets/whitefloor.jpg");
		game.load.image("throphy", "assets/throphy.png");
		game.load.spritesheet("scorencoin", "assets/scorencoin.png", 64, 64);
	},
	create : function(){
		var floor = game.add.tileSprite(0, 0, game.width, game.height, "floor");
		
		var mainMenuText = game.add.sprite(game.width/2, (game.height/2) - ((game.height/2)/3), "wed");
		mainMenuText.anchor.setTo(.5);
		
		
		
		var playButton = game.add.button(mainMenuText.x - 120, mainMenuText.y + 175, "button", goPlay);
		playButton.anchor.setTo(.5);
		var playButtonText = game.add.text(playButton.x, playButton.y + 5, "Play", buttonTextStyle);
		playButtonText.anchor.setTo(.5);
		var selectWeaponButton = game.add.button(mainMenuText.x + 120, mainMenuText.y + 175, "button", goSelectWeapon);
		selectWeaponButton.anchor.setTo(.5);
		var selectWeaponButtonText = game.add.text(selectWeaponButton.x, selectWeaponButton.y + 5, "Weapons", buttonTextStyle);
		selectWeaponButtonText.anchor.setTo(.5);
		
		var selectLevelButton = game.add.button(mainMenuText.x - 120, mainMenuText.y + 250, "button", goSelectLevel);
		selectLevelButton.anchor.setTo(.5);
		var selectLevelButtonText = game.add.text(selectLevelButton.x, selectLevelButton.y + 5, "Select Level", buttonTextStyle);
		selectLevelButtonText.anchor.setTo(.5);
		var storeButton = game.add.button(mainMenuText.x + 120, mainMenuText.y + 250, "button", goStore);
		storeButton.anchor.setTo(.5);
		var storeButtonText = game.add.text(storeButton.x, storeButton.y + 5, "Store", buttonTextStyle);
		storeButtonText.anchor.setTo(.5);
		
		var settingsButton = game.add.button(mainMenuText.x - 120, mainMenuText.y + 325, "button", goSettings);
		settingsButton.anchor.setTo(.5);
		var settingsButtonText = game.add.text(settingsButton.x, settingsButton.y + 5, "Settings", buttonTextStyle);
		settingsButtonText.anchor.setTo(.5);
		var aboutButton = game.add.button(mainMenuText.x + 120, mainMenuText.y + 325, "button", goAbout);
		aboutButton.anchor.setTo(.5);
		var aboutButtonText = game.add.text(aboutButton.x, aboutButton.y + 5, "About", buttonTextStyle);
		aboutButtonText.anchor.setTo(.5);
		
		var scoreImage = game.add.sprite(50, game.height-50, "scorencoin");
		scoreImage.anchor.setTo(.5);
		scoreImage.frame = 1;
		scoreImage.scale.setTo(.75);
		
		var playerScoreText = game.add.text(scoreImage.x + 35, scoreImage.y + 7, appData.score, boldTextStyle);
		playerScoreText.anchor.setTo(0, .5);
		
		var coinImage = game.add.sprite(210, game.height-50, "scorencoin");
		coinImage.anchor.setTo(.5);
		coinImage.frame = 0;
		coinImage.scale.setTo(.75);
		
		var playerScoreText = game.add.text(coinImage.x + 35, coinImage.y + 7, appData.cash, boldTextStyle);
		playerScoreText.anchor.setTo(0, .5);
	}
}

ZKGame.Settings = {
	preload : function(){
		game.load.image("buttonBack", "assets/buttonBack.png");
		game.load.image("button", "assets/button.png");
		game.load.image("floor", "assets/whitefloor.jpg");
	},
	create : function(){
		var floor = game.add.tileSprite(0, 0, game.width, game.height, "floor");
		
		var xText = game.add.text(game.world.centerX, game.world.centerY - 150, "Settings", boldTextStyle);
		xText.anchor.setTo(.5);
		
		var backButton = game.add.button(20, 20, "buttonBack", goBack);
		
		var resetButton = game.add.button(game.world.centerX, game.world.centerY, "button", goReset);
		resetButton.anchor.setTo(.5);
		var resetButtonText = game.add.text(resetButton.x, resetButton.y + 5, "Reset Score", buttonTextStyle);
		resetButtonText.anchor.setTo(.5);
	}
}

ZKGame.About = {
	preload : function(){
		game.load.image("buttonBack", "assets/buttonBack.png");
		game.load.image("logo", "assets/zkcs.png");
		game.load.image("floor", "assets/whitefloor.jpg");
	},
	create : function(){
		var floor = game.add.tileSprite(0, 0, game.width, game.height, "floor");
		
		var logo = game.add.sprite(game.world.centerX, game.world.centerY, "logo");
		logo.scale.setTo(.7);
		logo.anchor.setTo(.5);
		
		var xText = game.add.text(game.world.centerX, game.world.centerY - 150, "About", boldTextStyle);
		xText.anchor.setTo(.5);
		
		var backButton = game.add.button(20, 20, "buttonBack", goBack);
		
		var abtText = game.add.text(logo.x, logo.y + 120, "Developed by Habibie (Zofia Kreasi)\nwww.zofiakreasi.com", {font : "16px Arial", align : "center"});
		abtText.anchor.setTo(.5);
	}
}

ZKGame.Store = {
	preload : function(){
		game.load.image("buttonBack", "assets/buttonBack.png");
		game.load.image("productImg1", "assets/productImg1.png");
		game.load.image("productImg2", "assets/productImg2.png");
		game.load.image("productImg3", "assets/productImg3.png");
		game.load.image("productImg4", "assets/productImg4.png");
		game.load.image("floor", "assets/whitefloor.jpg");
	},
	create : function(){
		var floor = game.add.tileSprite(0, 0, game.width, game.height, "floor");
		
		var xText = game.add.text(game.world.centerX, game.world.centerY - 150, "Store", boldTextStyle);
		xText.anchor.setTo(.5);
		
		var backButton = game.add.button(20, 20, "buttonBack", goBack);
		
		var product1 = game.add.button(game.world.centerX - 225, game.world.centerY, "productImg1", buyIAP1);
		product1.anchor.setTo(.5);
		product1.scale.setTo(.7);
		
		var product2 = game.add.button(game.world.centerX - 75, game.world.centerY, "productImg2", buyIAP2);
		product2.anchor.setTo(.5);
		product2.scale.setTo(.7);
		
		var product3 = game.add.button(game.world.centerX + 75, game.world.centerY, "productImg3", buyIAP3);
		product3.anchor.setTo(.5);
		product3.scale.setTo(.7);
		
		var product4 = game.add.button(game.world.centerX + 225, game.world.centerY, "productImg4", buyIAP4);
		product4.anchor.setTo(.5);
		product4.scale.setTo(.7);
		
		var product1text = game.add.text(product1.x, product1.y + 80, "3,000 coins", plainTextStyle);
		product1text.anchor.setTo(.5);
		
		var product2text = game.add.text(product2.x, product2.y + 80, "7,500 coins", plainTextStyle);
		product2text.anchor.setTo(.5);
		
		var product3text = game.add.text(product3.x, product3.y + 80, "10,000 coins", plainTextStyle);
		product3text.anchor.setTo(.5);
		
		var product4text = game.add.text(product4.x, product4.y + 80, "Remove Ads", plainTextStyle);
		product4text.anchor.setTo(.5);
		
		function buyIAP1(){
			if(iAppService != null){
				iAppService.purchase("c3000", 1, function(error) { // Optional sugar callback
					if(error){
						//alert("Error: " + error);
					}else{
						//alert("Suksess!");
						iAppService.consume("c3000", 1, function(consumed, error){
							if(error){
								 //alert("Error: " + error);
							}
							else{
								 //alert("Consumed items: " + consumed);
								 alert("3000 coins added.");
								 appData.cash += 3000;
								 saveData();
							}
						});
					}
				});
			}
		}
		
		function buyIAP2(){
			if(iAppService != null){
				iAppService.purchase("c7500", 1, function(error) { // Optional sugar callback
					if(error){
						//alert("Error: " + error);
					}else{
						//alert("Suksess!");
						iAppService.consume("c7500", 1, function(consumed, error){
							if(error){
								 //alert("Error: " + error);
							}
							else{
								 //alert("Consumed items: " + consumed);
								 alert("7500 coins added.");
								 appData.cash += 7500;
								 saveData();
							}
						});
					}
				});
			}
		}
		
		function buyIAP3(){
			if(iAppService != null){
				iAppService.purchase("c10000", 1, function(error) { // Optional sugar callback
					if(error){
						//alert("Error: " + error);
					}else{
						//alert("Suksess!");
						iAppService.consume("c10000", 1, function(consumed, error){
							if(error){
								 //alert("Error: " + error);
							}
							else{
								 //alert("Consumed items: " + consumed);
								 alert("10000 coins added.");
								 appData.cash += 10000;
								 saveData();
							}
						});
					}
				});
			}
		}
		
		function buyIAP4(){
			if(iAppService != null){
				iAppService.purchase("removeads", 1, function(error) { // Optional sugar callback
					if(error){
						//alert("Error: " + error);
					}else{
						//alert("Suksess!");
						alert("Ads removed. App is restarting...");
						appData.noads = true;
						saveData();
						location.reload();
					}
				});
			}
		}
		
		if(iAppService != null){
			if(!appData.noads){
				if(iAppService.isPurchased("removeads")){
					appData.noads = true;
					saveData();
				}
			}
		}
	}
}

ZKGame.LevelLoading = {
	spinner : 0,
	preload : function(){
		loadLevel();
		game.load.image("spinner", "assets/spinner.png");
		game.load.image("floor", "assets/whitefloor.jpg");
	},
	create : function(){
		var floor = game.add.tileSprite(0, 0, game.width, game.height, "floor");
		
		var lvlText = game.add.text(game.width/2, game.height/2, "Loading level " + appData.selectedLevel, boldTextStyle);
		lvlText.anchor.setTo(.5);
		setTimeout(function(){
			game.state.start("Game");
		}, 1000);
		ZKGame.LevelLoading.spinner = game.add.sprite(game.world.centerX, game.world.centerY + 100, "spinner");
		ZKGame.LevelLoading.spinner.anchor.setTo(.5);
	},
	update : function(){
		ZKGame.LevelLoading.spinner.angle += 12;
	}
}

ZKGame.SelectLevel = {
	preload : function(){
		game.load.image("buttonBack", "assets/buttonBack.png");
		game.load.image("button", "assets/button.png");
		game.load.image("floor", "assets/whitefloor.jpg");
	},
	create : function(){
		var floor = game.add.tileSprite(0, 0, game.width, game.height, "floor");
		
		var selectedLevel = appData.selectedLevel;
		
		var xText = game.add.text(game.world.centerX, game.world.centerY - 150, "Select Level", boldTextStyle);
		xText.anchor.setTo(.5);
		
		var backButton = game.add.button(20, 20, "buttonBack", goBack);
		
		var levelText = game.add.text(xText.x, xText.y + 100, selectedLevel, {font: "60px arial", align : "center"});
		levelText.anchor.setTo(.5);
		
		var prevLevButton = game.add.button(levelText.x - 100, levelText.y, "buttonBack", goPrevLev);
		prevLevButton.anchor.setTo(.5);
		prevLevButton.scale.setTo(.85);
		var nextLevButton = game.add.button(levelText.x + 100, levelText.y, "buttonBack", goNextLev);
		nextLevButton.anchor.setTo(.5);
		nextLevButton.angle = 180;
		nextLevButton.scale.setTo(.85);
		
		var playLevelButton = game.add.button(game.world.centerX, game.world.centerY + 150, "button", goPlay);
		playLevelButton.anchor.setTo(.5);
		var playLevelButtonText = game.add.text(playLevelButton.x, playLevelButton.y + 5, "Play Level", buttonTextStyle);
		playLevelButtonText.anchor.setTo(.5);
		
		function goPrevLev(){
			if(selectedLevel > 1){
				selectedLevel -= 1;
				levelText.setText(selectedLevel);
				appData.selectedLevel = selectedLevel;
				updateLevelInfo();
			}
		}
		function goNextLev(){
			if(selectedLevel < appData.level){
				selectedLevel += 1;
				levelText.setText(selectedLevel);
				appData.selectedLevel = selectedLevel;
				updateLevelInfo();
			}
		}
		
		var levelInfoText = game.add.text(levelText.x, levelText.y + 100, "", plainTextStyle);
		levelInfoText.anchor.setTo(.5);
		updateLevelInfo();
		
		function updateLevelInfo(){
			loadLevel();
			levelInfoText.setText( "Defender(s): " + defCount + "\nEnemy(ies): " + enemyCount );
		}
	}
}

var popup;
var popupClosed = true;
var popupTween = null;
ZKGame.SelectWeapon = {
	preload : function(){
		game.load.image("buttonBack", "assets/buttonBack.png");
		game.load.image("purchasePanel", "assets/purchasePanel.png");
		game.load.image("floor", "assets/whitefloor.jpg");
		game.load.spritesheet("scorencoin", "assets/scorencoin.png", 64, 64);
	},
	create : function(){
		var floor = game.add.tileSprite(0, 0, game.width, game.height, "floor");
		
		var xText = game.add.text(game.world.centerX, game.world.centerY - 150, "Select Weapon", boldTextStyle);
		xText.anchor.setTo(.5);
		
		var backButton = game.add.button(20, 20, "buttonBack", goBack);
		
		var selectedWeapon = appData.selectedWeapon;
		
		var weaponText = game.add.text(xText.x, xText.y + 100, selectedWeapon, {font: "60px arial", align : "center"});
		weaponText.anchor.setTo(.5);
		
		var prevButton = game.add.button(weaponText.x - 100, weaponText.y, "buttonBack", goPrevW);
		prevButton.anchor.setTo(.5);
		prevButton.scale.setTo(.85);
		var nextButton = game.add.button(weaponText.x + 100, weaponText.y, "buttonBack", goNextW);
		nextButton.anchor.setTo(.5);
		nextButton.angle = 180;
		nextButton.scale.setTo(.85);
		
		var weaponInfoText = game.add.text(weaponText.x, weaponText.y + 100, "", plainTextStyle);
		weaponInfoText.anchor.setTo(.5);
		updateWIText();
		
		var selectWeaponButton = game.add.button(game.world.centerX, game.world.centerY + 150, "button", selectThisWeapon);
		selectWeaponButton.anchor.setTo(.5);
		var selectWeaponButtonText = game.add.text(selectWeaponButton.x, selectWeaponButton.y + 5, "Select", buttonTextStyle);
		selectWeaponButtonText.anchor.setTo(.5);
		
		var scoreImage = game.add.sprite(50, game.height-50, "scorencoin");
		scoreImage.anchor.setTo(.5);
		scoreImage.frame = 1;
		scoreImage.scale.setTo(.75);
		
		var playerScoreText = game.add.text(scoreImage.x + 35, scoreImage.y + 7, appData.score, boldTextStyle);
		playerScoreText.anchor.setTo(0, .5);
		
		var coinImage = game.add.sprite(210, game.height-50, "scorencoin");
		coinImage.anchor.setTo(.5);
		coinImage.frame = 0;
		coinImage.scale.setTo(.75);
		
		var playerScoreText = game.add.text(coinImage.x + 35, coinImage.y + 7, appData.cash, boldTextStyle);
		playerScoreText.anchor.setTo(0, .5);
		
		//purchase popup
		popup = game.add.sprite(game.world.centerX, game.world.centerY, "purchasePanel");
		popup.anchor.setTo(.5);
		popup.scale.setTo(0);
		popup.inputEnabled = true;
		popup.input.enableDrag();
		var pw = popup.width/2;
		var ph = popup.height/2;
		var popupTitle = game.add.text(pw, ph-100, "Buy New Weapon", {fill : "#ffffff"});
		popupTitle.anchor.setTo(.5);
		var purchaseInfoText = game.add.text(pw, ph, "Buy this weapon \nfor " + defWeapon(selectedWeapon).price + " coins?", {font : "28px Arial", align : "center", fill : "#ffffff"});
		purchaseInfoText.anchor.setTo(.5);
		
		var purchaseButton = game.add.button(pw, ph+100, "button", buyThisWeapon);
		purchaseButton.anchor.setTo(.5);
		purchaseButton.scale.setTo(.65, .75);
		var purchaseButtonText = game.add.text(purchaseButton.x, purchaseButton.y + 5, "Buy", buttonTextStyle);
		purchaseButtonText.anchor.setTo(.5);
		
		var closeButton = game.add.button(purchaseButton.x + 150, ph+100, "button", closePurchasePopout);
		closeButton.anchor.setTo(.5);
		closeButton.scale.setTo(.65, .75);
		var closeButtonText = game.add.text(purchaseButton.x + 150, purchaseButton.y + 5, "Close", buttonTextStyle);
		closeButtonText.anchor.setTo(.5);
		
		var buyCoinsButton = game.add.button(purchaseButton.x - 150, ph+100, "button", goStore);
		buyCoinsButton.anchor.setTo(.5);
		buyCoinsButton.scale.setTo(.65, .75);
		var buyCoinsButtonText = game.add.text(purchaseButton.x - 150, purchaseButton.y + 5, "Store", buttonTextStyle);
		buyCoinsButtonText.anchor.setTo(.5);
		
		popup.addChild(popupTitle);
		popup.addChild(purchaseInfoText);
		popup.addChild(purchaseButton);
		popup.addChild(purchaseButtonText);
		popup.addChild(closeButton);
		popup.addChild(closeButtonText);
		popup.addChild(buyCoinsButton);
		popup.addChild(buyCoinsButtonText);
		//end of purchase popup
		
		function updateWIText(){
			weaponInfoText.setText( "Price: " + defWeapon(selectedWeapon).price + 
					"\nDestruction: " + defWeapon(selectedWeapon).power + 
					"\nRate: " + defWeapon(selectedWeapon).fireRate + 
					"\nSpeed: " + defWeapon(selectedWeapon).speed);
		}
		
		function goPrevW(){
			if(selectedWeapon > 1){
				selectedWeapon -= 1;
				weaponText.setText(selectedWeapon);
				updateWIText();
				if(defWeapon(selectedWeapon).owned)
					selectWeaponButtonText.setText("Select");
				else
					selectWeaponButtonText.setText("Purchase");
			}
			if(!popupClosed){
				closePurchasePopout();
			}
			purchaseInfoText.setText("Buy this weapon \nfor " + defWeapon(selectedWeapon).price + " coins?");
		}
		function goNextW(){
			if(selectedWeapon < 12){
				selectedWeapon += 1;
				weaponText.setText(selectedWeapon);
				updateWIText();
				if(defWeapon(selectedWeapon).owned)
					selectWeaponButtonText.setText("Select");
				else
					selectWeaponButtonText.setText("Purchase");
			}
			if(!popupClosed){
				closePurchasePopout();
			}
			purchaseInfoText.setText("Buy this weapon \nfor " + defWeapon(selectedWeapon).price + " coins?");
		}
		function selectThisWeapon(){
			if(isWeaponOwned(selectedWeapon)){
				appData.selectedWeapon = selectedWeapon;
				saveData();
				game.state.start("MainMenu");
			}else{
				openPurchasePopout();
			}
		}
		function buyThisWeapon(){
			if(appData.cash >= defWeapon(selectedWeapon).price){
				appData.cash -= defWeapon(selectedWeapon).price;
				appData.weaponOwned.push(selectedWeapon);
				appData.selectedWeapon = selectedWeapon;
				saveData();
				game.state.start("SelectWeapon");
			}else{
				purchaseInfoText.setText("Not enough coins.");
				purchaseInfoText.scale.setTo(0);
				game.add.tween(purchaseInfoText.scale).to({x : 1, y : 1}, 1000, Phaser.Easing.Elastic.Out, true);
			}
		}
	}
}

function openPurchasePopout(){
	popupClosed = false;
	popupTween = game.add.tween(popup.scale).to({x : 1, y : 1}, 1000, Phaser.Easing.Elastic.Out, true);
}
function closePurchasePopout(){
	popupClosed = true;
	popupTween = game.add.tween(popup.scale).to({x : 0, y : 0}, 500, Phaser.Easing.Elastic.In, true);
}

ZKGame.WinScreen = {
	preload : function(){
		loadLevel();
		if(interstitial != null) 
			if(!appData.noads)
				interstitial.show();
	},
	create : function(){
		var floor = game.add.tileSprite(0, 0, game.width, game.height, "floor");
		
		var myText = game.add.text(game.width/2, game.height/2, randomEndGameMsg(1), boldTextStyle);
		myText.anchor.setTo(.5);
		
		var curScore = game.add.text(myText.x, myText.y + 50, "New Score: " + appData.score, plainTextStyle);
		curScore.anchor.setTo(.5);
		curScore.scale.setTo(0);
		var curCash = game.add.text(myText.x, myText.y + 70, "Your coins: " + appData.cash, plainTextStyle);
		curCash.anchor.setTo(.5);
		curCash.scale.setTo(0);
		game.add.tween(curScore.scale).to({x : 1, y : 1}, 1000, Phaser.Easing.Elastic.Out, true);
		game.add.tween(curCash.scale).to({x : 1, y : 1}, 1000, Phaser.Easing.Elastic.Out, true, 300);
		
		setTimeout(function(){
			game.state.start("LevelLoading");
		}, 2000);
	}
}

ZKGame.GameoverScreen = {
	preload : function(){
		loadLevel();
		if(interstitial != null) 
			if(!appData.noads)
				interstitial.show();
	},
	create : function(){
		var floor = game.add.tileSprite(0, 0, game.width, game.height, "floor");
		
		var myText = game.add.text(game.width/2, game.height/2, randomEndGameMsg(0), boldTextStyle);
		myText.anchor.setTo(.5);
		setTimeout(function(){
			game.state.start("LevelLoading");
		}, 2000);
	}
}

ZKGame.Game = {
	preload : function(){
		if(banner != null) banner.hide();
		game.load.image("bullet", "assets/bulot.png");
		game.load.image("defender", "assets/defender.png");
		game.load.image("enemyship", "assets/enemyship.png");
		game.load.spritesheet("explosion", "assets/explosion.png", 64, 64);
		game.load.spritesheet("spark", "assets/spark.png", 16, 16);
		game.load.image("buttonPause", "assets/buttonPause.png");
		game.load.image("earth", "assets/earth.png");
		game.load.image("stars", "assets/stars.jpg");
		gameover = false;
	}, 
	create : function(){
		game.stage.backgroundColor = "#333333";
		var stars = game.add.tileSprite(0, 0, game.width, game.height, "stars");
		var earth = game.add.sprite(0, game.height, "earth");
		earth.anchor.setTo(0, 1);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		for(var i = 0; i < defCount; i++){
			defenders.push({
				defender : 0,
				bullets : 0,
				fireRate : defWeapon(appData.selectedWeapon).fireRate + game.rnd.integerInRange(0, 20),
				nextFire : 0,
				power : defWeapon(appData.selectedWeapon).power,
			});
			defenders[i].bullets = game.add.group();
			defenders[i].bullets.enableBody = true;
			defenders[i].bullets.physicsBodyType = Phaser.Physics.ARCADE;
			defenders[i].bullets.createMultiple(50, "bullet");
			defenders[i].bullets.setAll("checkWorldBounds", true);
			defenders[i].bullets.setAll("outOfBoundsKill", true);
			defenders[i].defender = game.add.sprite((i+1) * (game.width/(defCount+1)), game.height-150, "defender");
			defenders[i].defender.anchor.setTo(.5);
			game.physics.enable(defenders[i].defender, Phaser.Physics.ARCADE);
			defenders[i].defender.body.allowRotation = false;
		}
		
		enemies = game.add.group();
		for (var i = 0; i < enemyCount; i++) {
			var randX = (Math.random() * (game.width-75)) + 75;
			var enemy = enemies.create(randX, -100, 'enemyship');
			enemy.anchor.setTo(.5, .5);
			enemy.speed = (Math.random() * enemySpeed) + 30;
			enemy.target = 0;
			enemy.health = enemyStrength;
			enemy.enableBody = true;
			enemy.physicsBodyType = Phaser.Physics.ARCADE;
			game.physics.enable(enemy, Phaser.Physics.ARCADE);
		}
		updateEnemyTarget();
		
		scoreText = game.add.text(game.width-20, 20, "Level Score: " + score, brightTextStyle);
		scoreText.anchor.setTo(1, 0);
		
		explosions = game.add.group();
		explosions.createMultiple(200, "explosion");
		explosions.forEach(setupExp, this);
		
		sparks = game.add.group();
		sparks.createMultiple(200, "spark");
		sparks.forEach(setupSpark, this);
		
		var pauseButton = game.add.sprite(20, 20, "buttonPause");
		pauseButton.inputEnabled = true;
		
		pauseButton.events.onInputUp.add(function(){
			game.paused = true;
			document.getElementById("pausemenu").style.display = "block";
		});
		game.input.onDown.add(function(){
			if(game.paused){
				document.getElementById("pausemenu").style.display = "none";
				game.paused = false;
			}
		});
	}, 
	update : function(){
		for(var i = 0; i < defenders.length; i ++){
			if (game.input.x == 0 && game.input.y == 0){
				defenders[i].defender.rotation = game.physics.arcade.angleToXY(defenders[i].defender, game.width/2, 0);
			} else
				defenders[i].defender.rotation = game.physics.arcade.angleToPointer(defenders[i].defender);
		}
		if(game.input.activePointer.isDown) {
			fire();
		}
		if(!gameover){
			checkCol();
			checkFireCol();
			moveTowardPlayer();
			checkGameStatus();
		}
		scoreText.setText("Level Score: " + score);
	}
}

game.state.add("LogoIntro", ZKGame.LogoIntro);
game.state.add("MainMenu", ZKGame.MainMenu);
game.state.add("SelectLevel", ZKGame.SelectLevel);
game.state.add("SelectWeapon", ZKGame.SelectWeapon);
game.state.add("Settings", ZKGame.Settings);
game.state.add("LevelLoading", ZKGame.LevelLoading);
game.state.add("Game", ZKGame.Game);
game.state.add("About", ZKGame.About);
game.state.add("Store", ZKGame.Store);
game.state.add("WinScreen", ZKGame.WinScreen);
game.state.add("GameoverScreen", ZKGame.GameoverScreen);
game.state.start("LogoIntro");

function setupExp(exp){
	exp.anchor.x = .5;
	exp.anchor.y = .5;
	exp.animations.add("explosion");
}

function setupSpark(spark){
	spark.anchor.x = .5;
	spark.anchor.y = .5;
	spark.animations.add("spark");
}

function fire(){
	for(var i = 0; i < defenders.length; i ++){
		if(game.time.now > defenders[i].nextFire && defenders[i].bullets.countDead() > 0){
			defenders[i].nextFire = game.time.now + defenders[i].fireRate;
			var bullet = defenders[i].bullets.getFirstDead();
			bullet.reset((defenders[i].defender.x - 5) + ((Math.random() * 10) + 0), defenders[i].defender.y);
			bullet.rotation = defenders[i].defender.rotation;
			game.physics.arcade.moveToPointer(bullet, defWeapon(appData.selectedWeapon).speed);
		}
	}
}

function moveTowardPlayer(){
	if(defenders.length > 0){
		for(var i = 0; i < enemies.children.length; i ++){
			game.physics.arcade.moveToObject(enemies.children[i], defenders[enemies.children[i].target].defender, enemies.children[i].speed);
			enemies.children[i].rotation = game.physics.arcade.angleToXY(enemies.children[i], defenders[enemies.children[i].target].defender.x, defenders[enemies.children[i].target].defender.y);
		}
	}	
}

function checkOverlap(x1, x2){
	var boundsA = x1.getBounds();
	var boundsB = x2.getBounds();
	return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function checkCol(){
	for(var i = 0; i < enemies.children.length; i++){
		for(var z = 0; z < defenders.length; z++){
			if(checkOverlap(enemies.children[i], defenders[z].defender)){
				//explosion anim
				var explosion = explosions.getFirstExists(false);
				explosion.reset(enemies.children[i].x, enemies.children[i].y);
				explosion.play("explosion", 30, false, true);
				enemies.children[i].kill();
				defenders[z].defender.kill();
				defenders[z].bullets.removeAll();
				defenders.splice(z, 1);
				updateEnemyTarget();
				game.camera.shake(0.02, 300);
			}
		}
	}
}

function checkFireCol(){
	for(var i = 0; i < enemies.children.length; i++){
		for(var z = 0; z < defenders.length; z++){
			for(var y = 0; y < defenders[z].bullets.children.length; y ++){
				game.physics.arcade.overlap(enemies.children[i], defenders[z].bullets.children[y], collisionHandler, null, this);
			}
		}
	}
}

function collisionHandler(enemy, bullet){
	bullet.kill();
	enemy.health -= defenders[0].power;
	
	//spark anim
	var spark = sparks.getFirstExists(false);
	spark.reset(bullet.x, bullet.y);
	spark.play("spark", 30, false, true);
	
	if(enemy.health <= 0) {
		
		//explosion anim
		var explosion = explosions.getFirstExists(false);
		explosion.reset(enemy.body.x, enemy.body.y);
		explosion.play("explosion", 30, false, true);
		
		enemy.kill();
		score += 12;
		scoreText.scale.setTo(1.3);
		game.add.tween(scoreText.scale).to({x : 1, y : 1}, 1000, Phaser.Easing.Elastic.Out, true);
	}
}

var distanceData;
function updateEnemyTarget(){
	if(defenders.length > 0){
		for(var i = 0; i < enemies.children.length; i++){
			distanceData = [];
			for(var z = 0; z < defenders.length; z++){
				distanceData.push(Phaser.Math.distance(enemies.children[i].x, enemies.children[i].y, defenders[z].defender.x, defenders[z].defender.y) + "def" + z);
			}
			distanceData.sort();
			enemies.children[i].target = parseInt(distanceData[0].split("def")[1]);
		}
	}
}

function loadLevel(){
	var defRate = .15;
	var enmRate = .55;
	defenders = [];
	defCount = Math.floor(appData.selectedLevel * defRate);
	enemyCount = Math.floor(appData.selectedLevel * enmRate);
	enemyStrength = Math.floor(appData.selectedLevel / 3);
	enemySpeed = Math.floor(appData.selectedLevel * 3);
	if(defCount < 1) defCount = 1;
	else if(defCount > 10) defCount = 10;
	if(enemyCount < 1) enemyCount = 1;
	if(enemyStrength < 1) enemyStrength = 1;
	if(enemySpeed < 50) enemySpeed = 50;
	appData.defRate += defRate;
	appData.enmRate += enmRate;
	score = 0;
	saveData();
}

function checkGameStatus(){
	//Defenders vanished
	if(defenders.length == 0 && !gameover){
		gameover = true;
		setTimeout(function(){ 
			game.state.start("GameoverScreen");
		}, 1000);
	}
	//Enemies vanished
	var aliveEnemies = 0;
	for(var i = 0; i < enemies.children.length; i++){
		if(enemies.children[i].alive) aliveEnemies += 1;
	}
	if(aliveEnemies == 0 && !gameover){
		gameover = true;
		setTimeout(function(){ 
			if(appData.selectedLevel == appData.level) {
				appData.level += 1;
				appData.selectedLevel = appData.level;
			}else 
				appData.selectedLevel += 1;
			appData.score += score;
			appData.cash += Math.floor(((defenders.length * 50) + score) / 12);
			saveData();
			
			game.state.start("WinScreen");
		}, 1000);
	}
}

function randomEndGameMsg(status){
	if(status == 0){
		var msg = [
			"Oh no...",
			"Try more harder.",
			"It's okay, try again.",
			"Dang it!",
			"Doh...",
			"OMG! Take revenge!"
		];
		return msg[Math.floor((Math.random() * msg.length) + 0)];
	}else{
		var msg = [
			"Nice job, boy!",
			"You made it!",
			"Cooool...",
			"Keep up!",
			"Wow, amazing...",
			"You are superb!"
		];
		return msg[Math.floor((Math.random() * msg.length) + 0)];
	}
}

//defWeapon
function defWeapon(weaponNum){
	var fireRate;
	var power;
	var speed;
	var bulletImg;
	var price;
	switch(weaponNum){
		case 1 :
			fireRate = 1000;
			power = 1;
			price = 100;
			speed = 200;
			break;
		case 2 :
			fireRate = 1000;
			power = 4;
			price = 400;
			speed = 200;
			break;
		case 3 :
			fireRate = 500;
			power = 5;
			price = 500;
			speed = 200;
			break;
		case 4 :
			fireRate = 100;
			power = 1;
			price = 750;
			speed = 200;
			break;
		case 5 :
			fireRate = 150;
			power = 3;
			price = 800;
			speed = 200;
			break;
		case 6 :
			fireRate = 300;
			power = 6;
			price = 1000;
			speed = 400;
			break;
		case 7 :
			fireRate = 300;
			power = 7;
			price = 1111;
			speed = 600;
			break;
		case 8 :
			fireRate = 300;
			power = 10;
			price = 3000;
			speed = 600;
			break;
		case 9 :
			fireRate = 150;
			power = 10;
			price = 5000;
			speed = 600;
			break;
		case 10 :
			fireRate = 150;
			power = 30;
			price = 10000;
			speed = 600;
			break;
		case 11 :
			fireRate = 100;
			power = 30;
			price = 15000;
			speed = 600;
			break;
		case 12 :
			fireRate = 50;
			power = 75;
			price = 30000;
			speed = 1500;
			break;
		default :
			fireRate = 1000;
			power = 1;
			price = 100;
			speed = 200;
	}
	var weapon = {
		fireRate : fireRate, 
		power : power, 
		speed : speed,
		bulletImg : "", 
		owned : isWeaponOwned(weaponNum),
		price : price
	};
	
	return weapon;
}

function isWeaponOwned(weaponNum){
	var isO = false;
	for(var i = 0; i < appData.weaponOwned.length; i++){
		if(weaponNum == appData.weaponOwned[i]) isO = true;
	}
	return isO;
}

//enemyProfile

//BUTTON FUNCTIONS

function goPlay(){
	game.state.start("LevelLoading");
}
function goSettings(){
	game.state.start("Settings");
}
function goSelectLevel(){
	game.state.start("SelectLevel");
}
function goSelectWeapon(){
	game.state.start("SelectWeapon");
}		
function goBack(){
	game.state.start("MainMenu");
}
function goStore(){
	game.state.start("Store");
}
function goReset(){
	appData.score = 0;
	saveData();
	game.state.start("MainMenu");
}
function goAbout(){
	game.state.start("About");
}

