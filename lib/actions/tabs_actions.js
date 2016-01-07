"use strict";

var TabsDispatcher = require("../dispatcher/tabs_dispatcher");

module.exports = {
  addingTabs: function addingTabs(tabs, id) {
    TabsDispatcher.handleAddingTabs({
      type: "ADDING_TABS",
      id: id,
      tabs: tabs
    });
  },

  changeDevice: function changeDevice(device) {
    TabsDispatcher.handleChangeDevice({
      type: "CHANGE_DEVICE",
      device: device
    });
  },

  changeTab: function changeTab(id, tab) {
    TabsDispatcher.handleChangeTab({
      type: "CHANGE_TAB",
      id: id,
      tab: tab
    });
  }
};
//# sourceMappingURL=tabs_actions.js.map