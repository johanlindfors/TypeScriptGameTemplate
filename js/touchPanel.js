var TouchPanel = (function () {
    function TouchPanel() {
        this.boundCanvas = null;
        this.touchHandler = null;
    }
    TouchPanel.prototype.enabled = function () {
        return window.navigator.msPointerEnabled;
    };
    TouchPanel.prototype.initialize = function (canvas, touchHandler) {
        this.boundCanvas = canvas;
        if(touchHandler) {
            canvas.addEventListener("MSPointerDown", this.start, false);
            canvas.addEventListener("MSPointerUp", this.end, false);
            canvas.addEventListener("MSPointerMove", this.move, false);
            canvas.addEventListener("MSPointerOut", this.cancel, false);
            canvas.addEventListener("MSPointerCancel", this.cancel, false);
            this.touchHandler = touchHandler;
        }
    };
    TouchPanel.prototype.start = function (e) {
        e.preventDefault();
        if((e.pointerType === e.MSPOINTER_TYPE_MOUSE) && (e.button === 0)) {
            return;
        }
        GameManager.touchPanel.touchHandler("start", e);
    };
    TouchPanel.prototype.move = function (e) {
        e.preventDefault();
        GameManager.touchPanel.touchHandler("move", e);
    };
    TouchPanel.prototype.end = function (e) {
        GameManager.touchPanel.touchHandler("end", e);
    };
    TouchPanel.prototype.cancel = function (e) {
        GameManager.touchPanel.touchHandler("cancel", e);
    };
    return TouchPanel;
})();
