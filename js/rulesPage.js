var rulesPage;
(function (rulesPage) {
    "use strict";
    function ready(element, options) {
        WinJS.UI.processAll(element).done(function () {
        });
    }
    WinJS.UI.Pages.define("/html/rulesPage.html", {
        ready: ready
    });
})(rulesPage || (rulesPage = {}));

