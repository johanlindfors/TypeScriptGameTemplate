///<reference path='win.ts'/>
///<reference path='movingAverage.ts'/>

class FrameTimer {
    public frameTimes = null;
    public lastTick = null;
    public fps = 1;
    public tickHandler = null;
    public timerId = null;

    reset(tickHandler, fps) {
        // Clear any current timer
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }

        if (fps && fps > 0) {
            this.fps = Math.min(fps, 60);
        } else {
            this.fps = 1;
        }

        this.frameTimes = new MovingAverage();
        this.frameTimes.initialize(this.fps);

        if (tickHandler) {
            this.tickHandler = tickHandler;
            var myself = this;
            this.timerId = setTimeout(() => { 
                myself.tick.apply(myself); 
            }, Math.max(0, (1000 / this.fps)));
        } else {
            this.tickHandler = null;
        }

        this.lastTick = (new Date()).getTime();
    }

    tick() {
        var myself = this;
        var newTick = (new Date()).getTime();
        var tickDelta = newTick - myself.lastTick;
        if (tickDelta > 3 * myself.frameTimes.average() && myself.frameTimes.values.length > myself.fps / 3) {
            // This protects the overall integrity of the timer in case of an unusually long update cycle
            tickDelta = myself.frameTimes.average();
        }
        myself.frameTimes.add(tickDelta);
        myself.lastTick = newTick;

        if (myself.tickHandler) {
            myself.tickHandler();

            if (myself.fps > 0) {
                myself.timerId = setTimeout(() => { myself.tick.apply(myself); }, Math.max(0, (1000 / myself.fps) - myself.frameTimes.average()));
            } else {
                myself.timerId = setTimeout(() => { myself.tick.apply(myself); }, 0 );
            }
        }
    }
}