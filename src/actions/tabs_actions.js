const TabsDispatcher = require("../dispatcher/tabs_dispatcher");

module.exports = {
  addingTabs:(tabs, id)=>{
    TabsDispatcher.handleAddingTabs({
      type : "ADDING_TABS",
      id   : id,
      tabs : tabs
    });
  },

  changeDevice:(device)=>{
    TabsDispatcher.handleChangeDevice({
      type   : "CHANGE_DEVICE",
      device : device
    });
  },

  changeTab:(id, tab)=>{
    TabsDispatcher.handleChangeTab({
      type : "CHANGE_TAB",
      id   : id,
      tab  : tab
    });
  }
};
