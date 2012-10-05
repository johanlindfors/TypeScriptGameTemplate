var creditsPage;
(function (creditsPage) {
    "use strict";
    function ready(element, options) {
        WinJS.UI.processAll(element).done(function () {
        });
    }
    WinJS.UI.Pages.define("/html/creditsPage.html", {
        ready: ready
    });
})(creditsPage || (creditsPage = {}));

