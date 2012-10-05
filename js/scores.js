var Scores = (function () {
    function Scores() {
        this.count = 10;
    }
    Scores.prototype.getSkillText = function (skill) {
        switch(skill) {
            case 0: {
                return "Basic";

            }
            case 1: {
                return "Intermediate";

            }
            case 2: {
                return "Advanced";

            }
        }
        return "Unknown";
    };
    Scores.prototype.getScores = function () {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
        var scoreString = roamingSettings.values["scores"];
        var loadedScores;
        if(!scoreString) {
            loadedScores = new Array(this.count);
            for(var i = 0; i < loadedScores.length; i++) {
                loadedScores[i] = {
                    player: "Player",
                    score: this.count - i,
                    skill: 1
                };
            }
            roamingSettings.values["scores"] = JSON.stringify(loadedScores);
        } else {
            loadedScores = JSON.parse(scoreString);
        }
        return loadedScores;
    };
    Scores.prototype.setScores = function (scoresToSet) {
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
        roamingSettings.values["scores"] = JSON.stringify(scoresToSet);
    };
    Scores.prototype.newScore = function (score) {
        var newScoreRank = 0;
        var scores = this.getScores();
        for(var i = scores.length - 1; i >= 0; i--) {
            if(score.score > scores[i].score) {
                if(i < scores.length - 1) {
                    scores[i + 1] = scores[i];
                    scores[i] = score;
                    newScoreRank = i + 1;
                }
                if(i === 0) {
                    scores[i] = score;
                    newScoreRank = 1;
                }
            } else {
                if(score.score === scores[i].score && i < scores.length - 1) {
                    scores[i + 1] = score;
                    newScoreRank = i + 2;
                    break;
                }
            }
        }
        this.setScores(scores);
        return newScoreRank;
    };
    return Scores;
})();
