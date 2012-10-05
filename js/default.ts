﻿///<reference path='win.ts'/>
///<reference path='game.ts'/>
///<reference path='touchPanel.ts'/>
///<reference path='gameState.ts'/>
///<reference path='assetManager.ts'/>
///<reference path='scores.ts'/>

module GameManager {
    "use strict";

    var app = WinJS.Application;

    var homeUrl = "/html/homePage.html";
    var gameUrl = "/html/gamePage.html";
    var rulesUrl = "/html/rulesPage.html";
    var scoresUrl = "/html/scoresPage.html";
    var creditsUrl = "/html/creditsPage.html";
    export var gameId = null;
    export var game = new Game();
    export var touchPanel = new TouchPanel();
    export var state = new GameState();
    state.load(null);
    export var assetManager = new AssetManager();
    var assetsLoaded = false;
    assetManager.load(game.getAssets(), assetLoadComplete);
    export var scoreHelper = new Scores();

    function assetLoadComplete() {
        assetsLoaded = true;
    }

    // Navigation support
    export function navigateHome() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== homeUrl) {
            // Navigate
            WinJS.Navigation.navigate(homeUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = homeUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    export function navigateGame() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== gameUrl) {
            // Navigate
            WinJS.Navigation.navigate(gameUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = gameUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    export function navigateRules() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== rulesUrl) {
            // Navigate
            WinJS.Navigation.navigate(rulesUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = rulesUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    export function navigateScores() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== scoresUrl) {
            // Navigate
            WinJS.Navigation.navigate(scoresUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = scoresUrl;

            // Hide the app bar
            document.getElementById("appbar").winControl.hide();
        }
    }

    export function navigateCredits() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== creditsUrl) {
            WinJS.Navigation.navigate(creditsUrl);

            // Update the current location for suspend/resume
            GameManager.state.config.currentPage = creditsUrl;
        }
    }

    // Preferences panel
    function showPreferences() {        
        //WinJS.UI.SettingsFlyout.show();
    }

    // Notification before App Bar or Settings are shown/hidden
    function onBeforeShow(e) {
        if (e.srcElement.id === "settingsDiv") {
            // Sync up the settings UI to match internal state
            GameManager.game.getSettings();
        }
        GameManager.game.showExternalUI(e);
    }

    function onAfterHide(e) {
        GameManager.game.hideExternalUI(e);
    }

    //WinJS.Application.onsettings = function (e) {
    //    e.detail.applicationcommands = {
    //       "settingsDiv": { title: "Game options", href: "/html/settingsFlyout.html" }
    //    };
    //    WinJS.UI.SettingsFlyout.populateSettings(e);
    //}

    // Activation
    WinJS.Application.onactivated = function (e: WinJS.Application.ApplicationActivationEvent) {
        if (e.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            // Game has been newly launched. Initialize game state here
            GameManager.game.initialize(GameManager.state);
        }
        e.setPromise(WinJS.UI.processAll().done(function () {
            // Set up initial AppBar button click handlers and styles
            var button;

            button = document.getElementById("home").winControl;
            button.addEventListener("click", GameManager.navigateHome, false);

            button = document.getElementById("play");
            button.winControl.addEventListener("click", GameManager.navigateGame, false);
            //WinJS.Utilities.addClass(button, "snapped-hidden");

            button = document.getElementById("rules");
            button.winControl.addEventListener("click", GameManager.navigateRules, false);
            //WinJS.Utilities.addClass(button, "snapped-hidden");

            button = document.getElementById("scores");
            button.winControl.addEventListener("click", GameManager.navigateScores, false);
            //WinJS.Utilities.addClass(button, "snapped-hidden");

            button = document.getElementById("credits");
            button.winControl.addEventListener("click", GameManager.navigateCredits, false);
            //WinJS.Utilities.addClass(button, "snapped-hidden");
            //WinJS.Utilities.addClass(button, "portrait-hidden");

            button = document.getElementById("newgame");
            button.winControl.addEventListener("click", GameManager.game.newGame, false);
            //WinJS.Utilities.addClass(button, "snapped-hidden");
            //WinJS.Utilities.addClass(button, "game-button");

            button = document.getElementById("pause");
            button.winControl.addEventListener("click", GameManager.game.togglePause, false);
            //WinJS.Utilities.addClass(button, "snapped-hidden");
            //WinJS.Utilities.addClass(button, "game-button");

            WinJS.Navigation.navigate(GameManager.state.config.currentPage);
        }));
    };

    // Suspend and resume
    function suspendingHandler(e) {
        if (this.state.config.currentPage === gameUrl) {
            GameManager.game.suspend(e);
        } else {
            GameManager.state.save(null);
        }
    }

    function resumingHandler(e) {
        if (this.state.config.currentPage === gameUrl) {
            GameManager.game.resume(e);
        }
    }

    // Notify game of loss and regain of focus
    function blurHandler(e) {
        if (WinJS.Navigation.location === gameUrl) {
            GameManager.game.hide();
        }
    }
    
    function focusHandler(e) {
        if (WinJS.Navigation.location === gameUrl) {
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
}
/*
(function () {
    "use strict";



    WinJS.Namespace.define("GameManager", {
        navigateHome: navigateHome,
        navigateGame: navigateGame,
        navigateRules: navigateRules,
        navigateScores: navigateScores,
        navigateCredits: navigateCredits,
        showPreferences: showPreferences,
        onBeforeShow: onBeforeShow,
        onAfterHide: onAfterHide,
        game: game,
        state: state,
        assetManager: assetManager,
        scoreHelper: scoreHelper,
        gameId: gameId,
        touchPanel: touchPanel
    });

})();
*/