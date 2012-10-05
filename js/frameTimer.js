var FrameTimer = (function () {
    function FrameTimer() {
        this.frameTimes = null;
        this.lastTick = null;
        this.fps = 1;
        this.tickHandler = null;
        this.timerId = null;
    }
    FrameTimer.prototype.reset = function (tickHandler, fps) {
        if(this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        if(fps && fps > 0) {
            this.fps = Math.min(fps, 60);
        } else {
            this.fps = 1;
        }
        this.frameTimes = new MovingAverage();
        this.frameTimes.initialize(this.fps);
        if(tickHandler) {
            this.tickHandler = tickHandler;
            var myself = this;
            this.timerId = setTimeout(function () {
                myself.tick.apply(myself);
            }, Math.max(0, (1000 / this.fps)));
        } else {
            this.tickHandler = null;
        }
        this.lastTick = (new Date()).getTime();
    };
    FrameTimer.prototype.tick = function () {
        var myself = this;
        var newTick = (new Date()).getTime();
        var tickDelta = newTick - myself.lastTick;
        if(tickDelta > 3 * myself.frameTimes.average() && myself.frameTimes.values.length > myself.fps / 3) {
            tickDelta = myself.frameTimes.average();
        }
        myself.frameTimes.add(tickDelta);
        myself.lastTick = newTick;
        if(myself.tickHandler) {
            myself.tickHandler();
            if(myself.fps > 0) {
                myself.timerId = setTimeout(function () {
                    myself.tick.apply(myself);
                }, Math.max(0, (1000 / myself.fps) - myself.frameTimes.average()));
            } else {
                myself.timerId = setTimeout(function () {
                    myself.tick.apply(myself);
                }, 0);
            }
        }
    };
    return FrameTimer;
})();
