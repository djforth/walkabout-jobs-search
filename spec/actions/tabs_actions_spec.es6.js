const TabsAction = require("../../src/actions/Tabs_actions");


const actionHelper = require("react-jasmine").checkActions;

describe("TabsAction", function() {

  let options = [
    {
      action:"addingTabs",
      handler:"handleAddingTabs",
      args:["foo", 1],
      dispactchArgs:{
        type : "ADDING_TABS",
        tabs : "foo",
        id   : 1
      }
    },
    {
      action:"changeDevice",
      handler:"handleChangeDevice",
      args:["foo"],
      dispactchArgs:{
        type   : "CHANGE_DEVICE",
        device : "foo"
      }
    },
    {
      action:"changeTab",
      handler:"handleChangeTab",
      args:[1, "foo"],
      dispactchArgs:{
        type : "CHANGE_TAB",
        id   : 1,
        tab  : "foo"
      }
    },
  ];



  actionHelper(TabsAction, "TabsDispatcher", options);

});