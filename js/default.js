var GameManager;
(function (GameManager) {
    "use strict";
    var app = WinJS.Application;
    var homeUrl = "/html/homePage.html";
    var gameUrl = "/html/gamePage.html";
    var rulesUrl = "/html/rulesPage.html";
    var scoresUrl = "/html/scoresPage.html";
    var creditsUrl = "/html/creditsPage.html";
    GameManager.gameId = null;
    GameManager.game = new Game();
    GameManager.touchPanel = new TouchPanel();
    GameManager.state = new GameState();
    GameManager.state.load(null);
    GameManager.assetManager = new AssetManager();
    var assetsLoaded = false;
    GameManager.assetManager.load(GameManager.game.getAssets(), assetLoadComplete);
    GameManager.scoreHelper = new Scores();
    function assetLoadComplete() {
        assetsLoaded = true;
    }
    function navigateHome() {
        var loc = WinJS.Navigation.location;
        if(loc !== "" && loc !== homeUrl) {
            WinJS.Navigation.navigate(homeUrl);
            GameManager.state.config.currentPage = homeUrl;
            document.getElementById("appbar").winControl.hide();
        }
    }
    GameManager.navigateHome = navigateHome;
    function navigateGame() {
        var loc = WinJS.Navigation.location;
        if(loc !== "" && loc !== gameUrl) {
            WinJS.Navigation.navigate(gameUrl);
            GameManager.state.config.currentPage = gameUrl;
            document.getElementById("appbar").winControl.hide();
        }
    }
    GameManager.navigateGame = navigateGame;
    function navigateRules() {
        var loc = WinJS.Navigation.location;
        if(loc !== "" && loc !== rulesUrl) {
            WinJS.Navigation.navigate(rulesUrl);
            GameManager.state.config.currentPage = rulesUrl;
            document.getElementById("appbar").winControl.hide();
        }
    }
    GameManager.navigateRules = navigateRules;
    function navigateScores() {
        var loc = WinJS.Navigation.location;
        if(loc !== "" && loc !== scoresUrl) {
            WinJS.Navigation.navigate(scoresUrl);
            GameManager.state.config.currentPage = scoresUrl;
            document.getElementById("appbar").winControl.hide();
        }
    }
    GameManager.navigateScores = navigateScores;
    function navigateCredits() {
        var loc = WinJS.Navigation.location;
        if(loc !== "" && loc !== creditsUrl) {
            WinJS.Navigation.navigate(creditsUrl);
            GameManager.state.config.currentPage = creditsUrl;
        }
    }
    GameManager.navigateCredits = navigateCredits;
    function showPreferences() {
    }
    function onBeforeShow(e) {
        if(e.srcElement.id === "settingsDiv") {
            GameManager.game.getSettings();
        }
        GameManager.game.showExternalUI(e);
    }
    function onAfterHide(e) {
        GameManager.game.hideExternalUI(e);
    }
    WinJS.Application.onactivated = function (e) {
        if(e.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            GameManager.game.initialize(GameManager.state);
        }
        e.setPromise(WinJS.UI.processAll().done(function () {
            var button;
            button = document.getElementById("home").winControl;
            button.addEventListener("click", GameManager.navigateHome, false);
            button = document.getElementById("play");
            button.winControl.addEventListener("click", GameManager.navigateGame, false);
            button = document.getElementById("rules");
            button.winControl.addEventListener("click", GameManager.navigateRules, false);
            button = document.getElementById("scores");
            button.winControl.addEventListener("click", GameManager.navigateScores, false);
            button = document.getElementById("credits");
            button.winControl.addEventListener("click", GameManager.navigateCredits, false);
            button = document.getElementById("newgame");
            button.winControl.addEventListener("click", GameManager.game.newGame, false);
            button = document.getElementById("pause");
            button.winControl.addEventListener("click", GameManager.game.togglePause, false);
            WinJS.Navigation.navigate(GameManager.state.config.currentPage);
        }));
    };
    function suspendingHandler(e) {
        if(this.state.config.currentPage === gameUrl) {
            GameManager.game.suspend(e);
        } else {
            GameManager.state.save(null);
        }
    }
    function resumingHandler(e) {
        if(this.state.config.currentPage === gameUrl) {
            GameManager.game.resume(e);
        }
    }
    function blurHandler(e) {
        if(WinJS.Navigation.location === gameUrl) {
            GameManager.game.hide();
        }
    }
    function focusHandler(e) {
        if(WinJS.Navigation.location === gameUrl) {
            GameManager.game.show();
        }
    }
    app.addEventListener("suspending", suspendingHandler, false);
    app.addEventListener("resuming", resumingHandler, false);
    window.addEventListener("blur", blurHandler, false);
    window.addEventListener("focus", focusHandler, false);
    document.addEventListener("beforeshow", onBeforeShow, false);
    document.addEventListener("afterhide", onAfterHide, false);
    app.start();
})(GameManager || (GameManager = {}));

