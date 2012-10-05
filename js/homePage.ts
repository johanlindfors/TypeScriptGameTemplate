///<reference path='win.ts'/>
///<reference path='default.ts'/>

module homePage {
    "use strict";

    function ready(element, options) {
        WinJS.UI.processAll(element)
            .done(function () {
                document.getElementById("playMenuItem").addEventListener("click", GameManager.navigateGame, false);
                document.getElementById("rulesMenuItem").addEventListener("click", GameManager.navigateRules, false);
                document.getElementById("scoresMenuItem").addEventListener("click", GameManager.navigateScores, false);
                document.getElementById("creditsMenuItem").addEventListener("click", GameManager.navigateCredits, false);
            });
    }

    WinJS.UI.Pages.define("/html/homePage.html", {
        ready: ready
    });
}