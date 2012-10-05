var MovingAverage = (function () {
    function MovingAverage() {
        this.values = new Array();
        this.valueCountMax = 20;
    }
    MovingAverage.prototype.initialize = function (valueCountMax) {
        this.valueCountMax = valueCountMax;
    };
    MovingAverage.prototype.add = function (newValue) {
        if(this.values.length > this.valueCountMax) {
            this.values.shift();
        }
        this.values.push(newValue);
    };
    MovingAverage.prototype.average = function () {
        if(this.values.length > 0) {
            return this.sum() / this.values.length;
        } else {
            return 0;
        }
    };
    MovingAverage.prototype.sum = function () {
        var runningSum = 0;
        for(var i = 0; i < this.values.length; i++) {
            runningSum += this.values[i];
        }
        return runningSum;
    };
    return MovingAverage;
})();
