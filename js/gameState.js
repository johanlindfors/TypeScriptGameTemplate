var GameState = (function () {
    function GameState() {
        this.config = new Config();
        this.external = new External();
        this.internal = new Internal();
    }
    GameState.prototype.load = function (flag) {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
        if(flag === undefined || flag === "config") {
            var configString = roamingSettings.values["config"];
            if(configString) {
                this.config = JSON.parse(configString);
            } else {
                this.save("config");
            }
        }
        if(flag === undefined || flag === "external") {
            var externalString = roamingSettings.values["external"];
            if(externalString) {
                this.external = JSON.parse(externalString);
            } else {
                this.save("external");
            }
        }
        if(flag === undefined || flag === "internal") {
            var internalString = roamingSettings.values["internal"];
            if(internalString) {
                this.internal = JSON.parse(internalString);
            } else {
                this.save("internal");
            }
        }
    };
    GameState.prototype.save = function (flag) {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
        if(flag === undefined || flag === "config") {
            roamingSettings.values["config"] = JSON.stringify(this.config);
        }
        if(flag === undefined || flag === "external") {
            roamingSettings.values["external"] = JSON.stringify(this.external);
        }
        if(flag === undefined || flag === "internal") {
            roamingSettings.values["internal"] = JSON.stringify(this.internal);
        }
    };
    return GameState;
})();
var Config = (function () {
    function Config() {
        this.frameRate = 20;
        this.currentPage = "/html/homePage.html";
        this.gameName = "SDK Game Sample";
    }
    return Config;
})();
var External = (function () {
    function External() {
        this.playerName = "Player";
        this.soundVolume = 100;
        this.skillLevel = 0;
    }
    return External;
})();
var Internal = (function () {
    function Internal() {
        this.gamePaused = false;
        this.gamePhase = "ready";
        this.position = {
            x: 100,
            y: 100
        };
        this.speed = {
            x: 5,
            y: 5
        };
        this.score = 0;
        this.bounce = 0;
        this.bounceLimit = 10;
    }
    return Internal;
})();
