///<reference path='win.ts'/>

class MovingAverage {
    public values: number[];
    public valueCountMax: number;

    constructor () {
        this.values = new number[];
        this.valueCountMax = 20;
    }

    initialize(valueCountMax) {
        this.valueCountMax = valueCountMax;
    }

    add(newValue) {
        if (this.values.length > this.valueCountMax) {
            this.values.shift();
        }
        this.values.push(newValue);
    }

    average() {
        if (this.values.length > 0) {
            return this.sum() / this.values.length;
        } else {
            return 0;
        }
    }

    sum() {
        var runningSum = 0;
        for (var i = 0; i < this.values.length; i++) {
            runningSum += this.values[i];
        }
        return runningSum;
    }
}
