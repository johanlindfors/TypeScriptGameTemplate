///<reference path='win.ts'/>
///<reference path='default.ts'/>
///<reference path='frameTimer.ts'/>

module gamePage {
    "use strict";

    function ready(element, options) {

        // Stop previous loop if it is running already
        if (GameManager.gameId !== null) {
            stopGameLoop();
        }

        WinJS.UI.processAll(element)
            .done(function () {
                gamePage.enableAppBarGameButtons();

                if (GameManager.gameId === null) {
                    // Set up game area
                    var gameCanvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
                    gameCanvas.width = window.innerWidth;
                    gameCanvas.height = window.innerHeight;

                    // Initialize update loop
                    if (GameManager.state.config.frameRate > 0) {
                        updateTimer.reset(updateLoop, GameManager.state.config.frameRate);
                    }

                    // Initialize draw loop
                    GameManager.gameId = window.requestAnimationFrame(gamePage.renderLoop);

                    // Set up touch panel
                    var touchCanvas = <HTMLCanvasElement>document.getElementById("touchCanvas");      
                    GameManager.touchPanel.initialize(touchCanvas, GameManager.game.doTouch);

                    // Prepare game for first-time showing
                    GameManager.game.showFirst();

                    // Set up media query listeners
                    setupMediaQueryListeners();
                }
            });
    }

    function unload(e) {
        this.disableAppBarGameButtons();

        // Stop previous loop if it is running
        if (GameManager.gameId !== null) {
            stopGameLoop();
        }
    }

    // Handle showing and hiding game buttons from the app bar
    export function enableAppBarGameButtons() {
        //WinJS.Utilities.removeClass(document.getElementById("newgame"), "game-button");
        //WinJS.Utilities.removeClass(document.getElementById("pause"), "game-button");
    }

    export function disableAppBarGameButtons() {
        //WinJS.Utilities.addClass(document.getElementById("newgame"), "game-button");
        //WinJS.Utilities.addClass(document.getElementById("pause"), "game-button");
    }


    // Stop drawing loop for the game
    function stopGameLoop() {
        window.cancelAnimationFrame(GameManager.gameId);
        GameManager.gameId = null;
    }

    var updateTimer = new FrameTimer();

    function setupMediaQueryListeners() {
        var mql = matchMedia("(-ms-view-state: snapped)");
        mql.addListener(snapListener);
    }
 
    function snapListener(mql)
    { 
        if (GameManager.state.config.currentPage === "/html/gamePage.html") {
            if (mql.matches) {
                GameManager.game.snap();
            } else {
                GameManager.game.unsnap();
            }
        }
    }

    export function renderLoop() {
        var gameCanvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
        if (typeof gameCanvas !== null) {
            GameManager.game.draw();
            window.requestAnimationFrame(renderLoop);
        }
    }

    export function updateLoop() {
        var gameCanvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
        if (typeof gameCanvas !== null) {
            GameManager.game.update();
        }
    }

    WinJS.UI.Pages.define("/html/gamePage.html", {
        ready: ready,
        unload: unload
    });

    //WinJS.Namespace.define("gamePage", {
    //    renderLoop: renderLoop,
    //    updateLoop: updateLoop,
    //    updateTimer: updateTimer,
    //    setupMediaQueryListeners: setupMediaQueryListeners,
    //    enableAppBarGameButtons: enableAppBarGameButtons,
    //    disableAppBarGameButtons: disableAppBarGameButtons
    //});
}
