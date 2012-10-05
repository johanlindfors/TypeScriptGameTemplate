var gamePage;
(function (gamePage) {
    "use strict";
    function ready(element, options) {
        if(GameManager.gameId !== null) {
            stopGameLoop();
        }
        WinJS.UI.processAll(element).done(function () {
            gamePage.enableAppBarGameButtons();
            if(GameManager.gameId === null) {
                var gameCanvas = document.getElementById("gameCanvas");
                gameCanvas.width = window.innerWidth;
                gameCanvas.height = window.innerHeight;
                if(GameManager.state.config.frameRate > 0) {
                    updateTimer.reset(updateLoop, GameManager.state.config.frameRate);
                }
                GameManager.gameId = window.requestAnimationFrame(gamePage.renderLoop);
                var touchCanvas = document.getElementById("touchCanvas");
                GameManager.touchPanel.initialize(touchCanvas, GameManager.game.doTouch);
                GameManager.game.showFirst();
                setupMediaQueryListeners();
            }
        });
    }
    function unload(e) {
        gamePage.disableAppBarGameButtons();
        if(GameManager.gameId !== null) {
            stopGameLoop();
        }
    }
    function enableAppBarGameButtons() {
    }
    gamePage.enableAppBarGameButtons = enableAppBarGameButtons;
    function disableAppBarGameButtons() {
    }
    gamePage.disableAppBarGameButtons = disableAppBarGameButtons;
    function stopGameLoop() {
        window.cancelAnimationFrame(GameManager.gameId);
        GameManager.gameId = null;
    }
    var updateTimer = new FrameTimer();
    function setupMediaQueryListeners() {
        var mql = matchMedia("(-ms-view-state: snapped)");
        mql.addListener(snapListener);
    }
    function snapListener(mql) {
        if(GameManager.state.config.currentPage === "/html/gamePage.html") {
            if(mql.matches) {
                GameManager.game.snap();
            } else {
                GameManager.game.unsnap();
            }
        }
    }
    function renderLoop() {
        var gameCanvas = document.getElementById("gameCanvas");
        if(gameCanvas != null) {
            GameManager.game.draw();
            window.requestAnimationFrame(renderLoop);
        }
    }
    gamePage.renderLoop = renderLoop;
    function updateLoop() {
        var gameCanvas = document.getElementById("gameCanvas");
        if(gameCanvas != null) {
            GameManager.game.update();
        }
    }
    gamePage.updateLoop = updateLoop;
    WinJS.UI.Pages.define("/html/gamePage.html", {
        ready: ready,
        unload: unload
    });
})(gamePage || (gamePage = {}));

