var scoresPage;
(function (scoresPage) {
    "use strict";
    var appLayout = Windows.UI.ViewManagement.ApplicationView;
    var appLayoutState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var pageData = null;
    var list = null;
    var groupedItems;
    function ready(element, options) {
        WinJS.UI.processAll(element).done(function () {
            if(list) {
                var listView = element.querySelector(".collectionList").winControl;
                pageData.groups = getGroups();
                pageData.items = getItems();
                list = new WinJS.Binding.List(pageData.items);
                groupedItems = list.createGrouped(groupKeySelector, groupDataSelector);
                listView.forceLayout();
            }
        });
    }
    function groupKeySelector(item) {
        return item.group.key;
    }
    function groupDataSelector(item) {
        return item.group;
    }
    function updateLayout(element, layoutState) {
        var listView = element.querySelector(".collectionList").winControl;
        if(!pageData) {
            pageData = {
            };
            pageData.groups = getGroups();
            pageData.items = getItems();
            list = new WinJS.Binding.List(pageData.items);
            groupedItems = list.createGrouped(groupKeySelector, groupDataSelector);
        }
        ui.setOptions(listView, {
            itemDataSource: groupedItems.dataSource,
            itemTemplate: element.querySelector(".itemTemplate"),
            groupDataSource: groupedItems.groups.dataSource,
            groupHeaderTemplate: element.querySelector(".headerTemplate"),
            oniteminvoked: itemInvoked
        });
        listView.layout = new ui.ListLayout({
            groupHeaderPosition: "top"
        });
    }
    function itemInvoked(e) {
        var lv = document.querySelector(".collectionList").winControl;
        var selectionIndex = e.detail.itemIndex;
        if(selectedScoreIndex !== selectionIndex) {
            var scores = GameManager.scoreHelper.getScores();
            selectedScore = scores[selectionIndex];
            selectedScoreIndex = selectionIndex;
            Windows.ApplicationModel.DataTransfer.DataTransferManager.showShareUI();
        } else {
            selectedScore = null;
            selectedScoreIndex = null;
        }
    }
    function getGroups() {
        var groups = [];
        groups.push({
            key: "group0",
            title: "",
            backgroundColor: "rgba(209, 211, 212, 1)"
        });
        return groups;
    }
    function getItems() {
        var colors = [
            "rgba(209, 211, 212, 1)", 
            "rgba(147, 149, 152, 1)", 
            "rgba(65, 64, 66, 1)"
        ];
        var scores = GameManager.scoreHelper.getScores();
        var items = [];
        var groupId = 0;
        for(var i = 0; i < scores.length; i++) {
            items.push({
                group: pageData.groups[groupId],
                key: "item" + i,
                rank: i + 1,
                player: scores[i].player,
                score: scores[i].score,
                skill: GameManager.scoreHelper.getSkillText(scores[i].skill),
                backgroundColor: colors[i % colors.length]
            });
        }
        return items;
    }
    var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
    var selectedScore = null;
    var selectedScoreIndex = null;
    WinJS.UI.Pages.define("/html/scoresPage.html", {
        ready: ready,
        updateLayout: updateLayout
    });
})(scoresPage || (scoresPage = {}));

