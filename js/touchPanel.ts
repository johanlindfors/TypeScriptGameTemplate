///<referece path='win.ts'/>

class TouchPanel {
    public boundCanvas = null;
    public touchHandler = null;
    
    enabled() {
        return window.navigator.msPointerEnabled; 
    }

    initialize(canvas, touchHandler) {
        this.boundCanvas = canvas;
        if (touchHandler) {
            canvas.addEventListener("MSPointerDown", this.start, false);
            canvas.addEventListener("MSPointerUp", this.end, false);
            canvas.addEventListener("MSPointerMove", this.move, false);
            canvas.addEventListener("MSPointerOut", this.cancel, false);
            canvas.addEventListener("MSPointerCancel", this.cancel, false);
            this.touchHandler = touchHandler;
        }
    }

    start(e) {
        e.preventDefault();

        if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE) && (e.button === 0)) {
            // We don't need to track mouse unless buttons are pressed
            return;
        }

        // Call registered handler in game logic
        GameManager.touchPanel.touchHandler("start", e);
    }

    move(e) {
        e.preventDefault();

        // Call registered handler in game logic
        GameManager.touchPanel.touchHandler("move", e);
    }

    end(e) {
        // Call registered handler in game logic
        GameManager.touchPanel.touchHandler("end", e);
    }

    cancel(e) {
        // Call registered handler in game logic
        GameManager.touchPanel.touchHandler("cancel", e);
    }
}