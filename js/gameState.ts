///<reference path='win.ts'/>

class GameState {

    public config: Config;
    public external: External;
    public internal: Internal;

    constructor() {
        this.config = new Config();
        this.external = new External();
        this.internal = new Internal();
    }

    load(flag) {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;

        if (flag === undefined || flag === "config") {
            var configString = roamingSettings.values["config"];
            if (configString) {
                this.config = JSON.parse(configString);
            } else {
                this.save("config"); // Save the defaults
            }
        }

        if (flag === undefined || flag === "external") {
            var externalString = roamingSettings.values["external"];
            if (externalString) {
                this.external = JSON.parse(externalString);
            } else {
                this.save("external"); // Save the defaults
            }
        }

        if (flag === undefined || flag === "internal") {
            var internalString = roamingSettings.values["internal"];
            if (internalString) {
                this.internal = JSON.parse(internalString);
            } else {
                this.save("internal"); // Save the defaults
            }
        }
    }

    save(flag) { 
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
        if (flag === undefined || flag === "config") {
            roamingSettings.values["config"] = JSON.stringify(this.config);
        }
        if (flag === undefined || flag === "external") {
            roamingSettings.values["external"] = JSON.stringify(this.external);
        }
        if (flag === undefined || flag === "internal") {
            roamingSettings.values["internal"] = JSON.stringify(this.internal);
        }
    }
}

class Config {
    public frameRate = 20;
    public currentPage = "/html/homePage.html";
    public gameName = "SDK Game Sample";
}

class External {
    public playerName = "Player";
    public soundVolume = 100;
    public skillLevel = 0;
}

class Internal {
    public gamePaused = false;
    public gamePhase = "ready";
    public position = { x: 100, y: 100 };
    public speed = { x: 5, y: 5 };
    public score = 0;
    public bounce = 0;
    public bounceLimit = 10;
}
