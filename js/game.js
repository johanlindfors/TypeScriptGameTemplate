var Game = (function () {
    function Game() {
        this.gameContext = null;
        this.stateHelper = null;
        this.state = null;
        this.settings = null;
        this.gameCanvas = null;
    }
    Game.prototype.isSnapped = function () {
        var currentState = Windows.UI.ViewManagement.ApplicationView.value;
        return currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped;
    };
    Game.prototype.initialize = function (state) {
        if(GameManager.gameId === null) {
            this.stateHelper = state;
            this.state = state.internal;
            this.settings = state.external;
        }
    };
    Game.prototype.getAssets = function () {
        var assets = {
            sndBounce: {
                object: null,
                fileName: "/sounds/bounce.wav",
                fileType: AssetType.audio,
                loop: false
            }
        };
        return assets;
    };
    Game.prototype.showFirst = function () {
        if(this.state.gamePhase === "started") {
            this.pause();
        }
        var gameCanvas = document.getElementById("gameCanvas");
        this.gameContext = gameCanvas.getContext("2d");
    };
    Game.prototype.show = function () {
    };
    Game.prototype.hide = function () {
        this.pause();
    };
    Game.prototype.snap = function () {
        this.pause();
        var gameCanvas = document.getElementById("gameCanvas");
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
    };
    Game.prototype.unsnap = function () {
        if(this.state.position.x > window.innerWidth) {
            this.state.position.x += window.innerWidth - this.state.position.x;
        }
        if(this.state.position.y > window.innerHeight) {
            this.state.position.y += window.innerHeight - this.state.position.y;
        }
        var gameCanvas = document.getElementById("gameCanvas");
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
        this.unpause();
    };
    Game.prototype.newGame = function () {
        GameManager.game.ready();
    };
    Game.prototype.ready = function () {
        if(this.isSnapped()) {
            this.state.gamePaused = true;
        } else {
            this.state.gamePaused = false;
        }
        this.state.gamePhase = "ready";
        switch(this.settings.skillLevel) {
            case 0: {
                this.state.speed.x = 5;
                this.state.speed.y = 5;
                this.state.bounceLimit = 10;
                break;

            }
            case 1: {
                this.state.speed.x = 10;
                this.state.speed.y = 4;
                this.state.bounceLimit = 8;
                break;

            }
            case 2: {
                this.state.speed.x = 8;
                this.state.speed.y = 12;
                this.state.bounceLimit = 5;
                break;

            }
        }
        this.state.position.x = 100;
        this.state.position.y = 100;
        this.state.score = 0;
        this.state.bounce = 0;
    };
    Game.prototype.start = function () {
        if(!this.isSnapped()) {
            this.state.gamePhase = "started";
        }
    };
    Game.prototype.end = function () {
        this.state.gamePhase = "ended";
        var newRank = GameManager.scoreHelper.newScore({
            player: this.settings.playerName,
            score: this.state.score,
            skill: this.settings.skillLevel
        });
    };
    Game.prototype.pause = function () {
        this.state.gamePaused = true;
    };
    Game.prototype.unpause = function () {
        if(!this.isSnapped()) {
            this.state.gamePaused = false;
        }
    };
    Game.prototype.togglePause = function () {
        if(GameManager.game.state.gamePaused) {
            GameManager.game.unpause();
        } else {
            GameManager.game.pause();
        }
    };
    Game.prototype.doTouch = function (touchType, e) {
        switch(touchType) {
            case "start": {
                GameManager.game.touchStart(e);
                break;

            }
            case "end": {
                GameManager.game.touchEnd(e);
                break;

            }
            case "move": {
                GameManager.game.touchMove(e);
                break;

            }
            case "cancel": {
                GameManager.game.touchCancel(e);
                break;

            }
        }
    };
    Game.prototype.touchStart = function (e) {
        if(this.state.gamePhase === "ready") {
            this.start();
        }
    };
    Game.prototype.touchEnd = function (e) {
        if(this.state.gamePhase === "started" && !this.state.gamePaused) {
            if(Math.sqrt(((e.x - this.state.position.x) * (e.x - this.state.position.x)) + ((e.y - this.state.position.y) * (e.y - this.state.position.y))) < 50) {
                this.state.score++;
            }
        }
    };
    Game.prototype.touchMove = function (e) {
    };
    Game.prototype.touchCancel = function (e) {
    };
    Game.prototype.showExternalUI = function (e) {
        if(e.srcElement.id === "settingsDiv") {
            this.pause();
        }
    };
    Game.prototype.hideExternalUI = function (e) {
        if(e.srcElement.id === "settingsDiv") {
            this.unpause();
        }
    };
    Game.prototype.getSettings = function () {
    };
    Game.prototype.setSettings = function () {
        var skill = 0;
        if(this.settings.skillLevel !== skill) {
            this.settings.skillLevel = skill;
            this.ready();
            this.stateHelper.save("internal");
        }
        this.stateHelper.save("external");
    };
    Game.prototype.suspend = function (e) {
        this.pause();
        this.stateHelper.save(null);
    };
    Game.prototype.resume = function (e) {
    };
    Game.prototype.update = function () {
        if(!this.state.gamePaused && this.state.gamePhase === "started") {
            var gameCanvas = document.getElementById("gameCanvas");
            if(this.state.position.x < 0 || this.state.position.x > gameCanvas.width) {
                this.state.speed.x = -this.state.speed.x;
                this.state.bounce++;
                GameManager.assetManager.playSound(GameManager.assetManager.assets.sndBounce);
            }
            if(this.state.position.y < 0 || this.state.position.y > gameCanvas.height) {
                this.state.speed.y = -this.state.speed.y;
                this.state.bounce++;
                GameManager.assetManager.playSound(GameManager.assetManager.assets.sndBounce);
            }
            this.state.position.x += this.state.speed.x;
            this.state.position.y += this.state.speed.y;
            if(this.state.bounce >= this.state.bounceLimit) {
                this.end();
            }
        }
    };
    Game.prototype.draw = function () {
        var gameCanvas = document.getElementById("gameCanvas");
        this.gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        this.gameContext.beginPath();
        this.gameContext.fillStyle = "#FFFFFF";
        this.gameContext.arc(this.state.position.x, this.state.position.y, 20, 0, Math.PI * 2, true);
        this.gameContext.closePath();
        this.gameContext.fill();
        this.gameContext.fillStyle = "#FFFF99";
        this.gameContext.font = "bold 48px Segoe UI";
        this.gameContext.textBaseline = "middle";
        this.gameContext.textAlign = "right";
        this.gameContext.fillText(this.state.score, gameCanvas.width - 5, 20);
        if(this.state.gamePhase === "ready") {
            this.gameContext.textAlign = "center";
            this.gameContext.fillText("READY", gameCanvas.width / 2, gameCanvas.height / 2);
        } else {
            if(this.state.gamePhase === "ended") {
                this.gameContext.textAlign = "center";
                this.gameContext.fillText("GAME OVER", gameCanvas.width / 2, gameCanvas.height / 2);
            } else {
                if(this.state.gamePaused) {
                    this.gameContext.textAlign = "center";
                    this.gameContext.fillText("PAUSED", gameCanvas.width / 2, gameCanvas.height / 2);
                }
            }
        }
        this.gameContext.fillStyle = "#FF8040";
        this.gameContext.textAlign = "left";
        this.gameContext.fillText(Math.max(this.state.bounceLimit - this.state.bounce, 0), 5, 20);
    };
    return Game;
})();
