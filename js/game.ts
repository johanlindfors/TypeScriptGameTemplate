﻿///<reference path='win.ts'/>
///<reference path='gameState.ts'/>
///<reference path='default.ts'/>

class Game {
    public gameContext = null;
    public stateHelper : GameState = null;
    public state = null;
    public settings = null;
    private gameCanvas: HTMLCanvasElement;
  
    isSnapped(): bool { 
        var currentState = Windows.UI.ViewManagement.ApplicationView.value;
        return currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped;    
    }

    // Called when Game is first loaded
    public initialize(state : GameState) {
        if (GameManager.gameId === null) {
            this.stateHelper = state;
            this.state = state.internal;
            this.settings = state.external;
        }
    }

    // Called to get list of assets to pre-load
    getAssets() {
        // To add asset to a list of loading assets follow the the examples below
        var assets = {
            sndBounce: { object: null, fileName: "/sounds/bounce.wav", fileType: AssetType.audio, loop: false },
            //// backgroundImage: { object: null, fileName: "/images/background.jpg", fileType: AssetType.image },
            //// sndMusic: { object: null, fileName: "/sounds/music", fileType: AssetType.audio, loop: true }
        };
        return assets;
    }

    // Called the first time the game is shown
    showFirst() {
        // If game was previously running, pause it.
        if (this.state.gamePhase === "started") {
            this.pause();
        }

        // Note: gameCanvas is the name of the <canvas> in default.html
        this.gameCanvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
        this.gameContext = this.gameCanvas.getContext("2d");
    }

    // Called each time the game is shown
    show() {

    }

    // Called each time the game is hidden
    hide() {
        this.pause();
    }

    // Called when the game enters snapped view
    snap() {
        // TODO: Update game state when in snapped view - basic UI styles can be set with media queries in gamePage.css
        this.pause();
        // Temporarily resize game area to maintain aspect ratio        
        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;
    }

        // Called when the game enters fill or full-screen view
    unsnap() {
        // TODO: Update game state when in fill, full-screen, or portrait view - basic UI styles can be set with media queries in gamePage.css

        // It's possible the ball is now outside the play area. Fix it if so.
        if (this.state.position.x > window.innerWidth) {
            this.state.position.x += window.innerWidth - this.state.position.x;
        }
        if (this.state.position.y > window.innerHeight) {
            this.state.position.y += window.innerHeight - this.state.position.y;
        }

        // Restore game area to new aspect ratio
        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;

        // Resume playing
        this.unpause();
    }

    // Called to reset the game
    newGame() {
        GameManager.game.ready();
    }

    // Called when the game is being prepared to start
    ready() {
        // TODO: Replace with your own new game initialization logic
        if (this.isSnapped()) {
            this.state.gamePaused = true;
        } else {
            this.state.gamePaused = false;
        }
        this.state.gamePhase = "ready";
        switch (this.settings.skillLevel) {
            case 0:
                this.state.speed.x = 5;
                this.state.speed.y = 5;
                this.state.bounceLimit = 10;
                break;
            case 1:
                this.state.speed.x = 10;
                this.state.speed.y = 4;
                this.state.bounceLimit = 8;
                break;
            case 2:
                this.state.speed.x = 8;
                this.state.speed.y = 12;
                this.state.bounceLimit = 5;
                break;
        }
        this.state.position.x = 100;
        this.state.position.y = 100;
        this.state.score = 0;
        this.state.bounce = 0;
    }

    // Called when the game is started
    start() {
        // Don't allow start when game is snapped
        if (!this.isSnapped()) {
            this.state.gamePhase = "started";
        }
    }
    
    // Called when the game is over
    end() {
        this.state.gamePhase = "ended";
        var newRank = GameManager.scoreHelper.newScore({ player: this.settings.playerName, score: this.state.score, skill: this.settings.skillLevel });
    }

    // Called when the game is paused
    pause() {
        this.state.gamePaused = true;
    }

    // Called when the game is un-paused
    unpause() {
        // Don't allow unpause when game is snapped
        if (!this.isSnapped()) {
            this.state.gamePaused = false;
        }
    }

    // Called to toggle the pause state
    togglePause() {
        if (GameManager.game.state.gamePaused) {
            GameManager.game.unpause();
        } else {
            GameManager.game.pause();
        }
    }

    // Touch events... All touch events come in here before being passed onward based on type
    doTouch(touchType, e) {
        switch (touchType) {
            case "start": GameManager.game.touchStart(e); break;
            case "end": GameManager.game.touchEnd(e); break;
            case "move": GameManager.game.touchMove(e); break;
            case "cancel": GameManager.game.touchCancel(e); break;
        }
    }

    touchStart(e) {
        // TODO: Replace game logic
        // Touch screen to move from ready phase to start the game
        if (this.state.gamePhase === "ready") {
            this.start();
        }
    }

    touchEnd(e) {
        // TODO: Replace game logic.
        if (this.state.gamePhase === "started" && !this.state.gamePaused) {
            if (Math.sqrt(((e.x - this.state.position.x) * (e.x - this.state.position.x)) +
            ((e.y - this.state.position.y) * (e.y - this.state.position.y))) < 50) {
                this.state.score++;
            }
        }
    }
    
    touchMove(e) {
        // TODO: Add game logic
    }

    touchCancel(e) {
        // TODO: Add game logic
    }

    // Called before preferences panel or app bar is shown
    showExternalUI(e) {
        if (e.srcElement.id === "settingsDiv") {
            this.pause();
        }
    }

    // Called after preferences panel or app bar is hidden
    hideExternalUI(e) {
        if (e.srcElement.id === "settingsDiv") {
            this.unpause();
        }
    }

    // Called by settings panel to populate the current values of the settings
    getSettings() {
        // Note: The left side of these assignment operators refers to the setting controls in default.html
        // TODO: Update to match any changes in settings panel
        //settingPlayerName.value = this.settings.playerName;
        //settingSoundVolume.value = this.settings.soundVolume;
        //for (var i = 0; i < settingSkillLevel.length; i++) {
        //    if (settingSkillLevel[i].value === "" + this.settings.skillLevel) {
        //        settingSkillLevel[i].checked = true;
        //    }
        //}
    }

    // Called when changes are made on the settings panel
    setSettings() {
        // Note: The right side of these assignment operators refers to the controls in default.html
        // TODO: Update to match any changes in settings panel
        //this.settings.playerName = settingPlayerName.value;
        //this.settings.soundVolume = settingSoundVolume.value;
        // Changing the skill level re-starts the game
        var skill = 0;
        //for (var i = 0; i < settingSkillLevel.length; i++) {
        //    if (settingSkillLevel[i].checked) {
        //        skill = parseInt(settingSkillLevel[i].value);
        //    }
        //}
        if (this.settings.skillLevel !== skill) {
            // Update the skill level
            this.settings.skillLevel = skill;

            // Start a new game so high scores represent entire games at a given skill level only.
            this.ready();

            // Save state so that persisted skill-derived values match the skill selected
            this.stateHelper.save("internal");
        }

        // Save settings out
        this.stateHelper.save("external");
    }

    // Called when the app is suspended
    suspend(e) {
        this.pause();
        this.stateHelper.save(null);
    }

    // Called when the app is resumed
    resume(e) {
    }

    // Main game update loop
    update() {
        // TODO: Sample game logic to be replaced
        if (!this.state.gamePaused && this.state.gamePhase === "started") {
            
            if (this.state.position.x < 0 || this.state.position.x > this.gameCanvas.width) {
                this.state.speed.x = -this.state.speed.x;
                this.state.bounce++;

                // Play bounce sound
                GameManager.assetManager.playSound(GameManager.assetManager.assets.sndBounce);
            }
            if (this.state.position.y < 0 || this.state.position.y > this.gameCanvas.height) {
                this.state.speed.y = -this.state.speed.y;
                this.state.bounce++;

                // Play bounce sound
                GameManager.assetManager.playSound(GameManager.assetManager.assets.sndBounce);
            }
            this.state.position.x += this.state.speed.x;
            this.state.position.y += this.state.speed.y;
            
            // Check if game is over
            if (this.state.bounce >= this.state.bounceLimit) {
                this.end();
            }
        }
    }

    // Main game render loop
    draw() {
        this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        // TODO: Sample game rendering to be replaced

        // Draws on canvas a circle of radius 20 at the coordinates defined by position attribute
        this.gameContext.beginPath();
        this.gameContext.fillStyle = "#FFFFFF";
        this.gameContext.arc(this.state.position.x, this.state.position.y, 20, 0, Math.PI * 2, true);
        this.gameContext.closePath();
        this.gameContext.fill();

        // Draw the current score
        this.gameContext.fillStyle = "#FFFF99";
        this.gameContext.font = "bold 48px Segoe UI";
        this.gameContext.textBaseline = "middle";
        this.gameContext.textAlign = "right";
        this.gameContext.fillText(this.state.score, this.gameCanvas.width - 5, 20);

        // Draw a ready or game over or paused indicator
        if (this.state.gamePhase === "ready") {
            this.gameContext.textAlign = "center";
            this.gameContext.fillText("READY", this.gameCanvas.width / 2, this.gameCanvas.height / 2);
        } else if (this.state.gamePhase === "ended") {
            this.gameContext.textAlign = "center";
            this.gameContext.fillText("GAME OVER", this.gameCanvas.width / 2, this.gameCanvas.height / 2);
        } else if (this.state.gamePaused) {
            this.gameContext.textAlign = "center";
            this.gameContext.fillText("PAUSED", this.gameCanvas.width / 2, this.gameCanvas.height / 2);
        }

        // Draw the number of bounces remaining
        this.gameContext.fillStyle = "#FF8040";
        this.gameContext.textAlign = "left";
        this.gameContext.fillText(Math.max(this.state.bounceLimit - this.state.bounce, 0), 5, 20);
    }
}
